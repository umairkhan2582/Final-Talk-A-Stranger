// useWebRTC.ts (optimized, Version B)
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface MatchInfo {
  partnerId: string;
  partnerUsername: string;
  isInitiator: boolean;
  myLocation?: string;
  partnerLocation?: string;
}

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  username?: string;
  timestamp: Date;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  isSearching: boolean;
  partnerUsername: string;
  messages: Message[];
  error: string | null;
  myLocationSlug: string | null;
  partnerLocationSlug: string | null;
  startSearching: (username: string, originLocation?: string) => void;
  skipPartner: () => void;
  sendMessage: (message: string) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // Add TURN servers here when you have them for production
  ],
};

export function useWebRTC(): UseWebRTCReturn {
  // ---------- states ----------
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [myLocationSlug, setMyLocationSlug] = useState<string | null>(null);
  const [partnerLocationSlug, setPartnerLocationSlug] = useState<string | null>(null);

  // ---------- refs ----------
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const partnerIdRef = useRef<string>("");
  const partnerUsernameRef = useRef<string>("");
  const currentUsernameRef = useRef<string>("");
  const localStreamRef = useRef<MediaStream | null>(null);
  const myLocationRef = useRef<string | null>(null);

  // queue candidates that may arrive before remote description is set
  const pendingRemoteCandidatesRef = useRef<Array<RTCIceCandidateInit>>([]);

  // prevent requeue loops - small backoff
  const requeueTimeoutRef = useRef<number | null>(null);

  // indicate whether current side created the offer
  const isInitiatorRef = useRef<boolean | null>(null);

  // ---------- helpers ----------
  const safeLog = (...args: any[]) => {
    // change to debug logger as needed
    console.debug("[useWebRTC]", ...args);
  };

  const cleanupPeerConnection = useCallback(() => {
    safeLog("cleanupPeerConnection called");

    // clear pending candidates
    pendingRemoteCandidatesRef.current = [];

    // remove and stop tracks on pc senders (if any)
    const pc = peerConnectionRef.current;
    if (pc) {
      try {
        // remove senders (best-effort)
        pc.getSenders().forEach((sender) => {
          try {
            if (sender.track) {
              pc.removeTrack(sender);
            }
          } catch (err) {
            // ignore
          }
        });
      } catch (err) {
        // ignore
      }

      try {
        pc.close();
      } catch (err) {
        // ignore
      }
      peerConnectionRef.current = null;
    }

    // Keep local stream alive (we only stop it on unmount). But reset local refs used for PC
    setRemoteStream(null);
    setIsConnected(false);
    setPartnerUsername("");
    setMessages([]);
    partnerIdRef.current = "";
    partnerUsernameRef.current = "";
    isInitiatorRef.current = null;

    // clear any requeue timeout
    if (requeueTimeoutRef.current) {
      clearTimeout(requeueTimeoutRef.current);
      requeueTimeoutRef.current = null;
    }
  }, []);

  const createPeerConnection = useCallback(
    (partnerId: string) => {
      // If a peer connection already exists for the same partner, reuse it.
      if (peerConnectionRef.current) {
        safeLog("createPeerConnection: pc already exists — reusing");
        partnerIdRef.current = partnerId;
        return peerConnectionRef.current;
      }

      safeLog("createPeerConnection: creating new PC for", partnerId);

      const pc = new RTCPeerConnection(ICE_SERVERS);

      peerConnectionRef.current = pc;
      partnerIdRef.current = partnerId;

      // Attach local tracks (if we have a local stream)
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, stream);
          } catch (err) {
            // ignore if addTrack fails for any browser quirk
          }
        });
      }

      // When remote tracks arrive
      pc.ontrack = (event) => {
        safeLog("pc.ontrack", event.streams);
        // use the first stream available
        const remote =
          event.streams && event.streams[0] ? event.streams[0] : null;
        if (remote) {
          setRemoteStream(remote);
        }
      };

      // ICE candidates from local side -> send to partner
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current && partnerIdRef.current) {
          safeLog("sending local ICE candidate to", partnerIdRef.current);
          socketRef.current.emit("webrtc-ice-candidate", {
            candidate: event.candidate,
            to: partnerIdRef.current,
          });
        }
      };

      // Connection state handling
      pc.onconnectionstatechange = () => {
        safeLog("pc.connectionState:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setIsConnected(true);
          setIsSearching(false);
        } else if (pc.connectionState === "disconnected") {
          // keep remote stream for a short while? we'll cleanup to be safe
          cleanupPeerConnection();
        } else if (pc.connectionState === "failed") {
          // try a single automatic retry: cleanup and let the UI requeue
          cleanupPeerConnection();
        } else if (pc.connectionState === "closed") {
          cleanupPeerConnection();
        }
      };

      // Track negotiation needed - handle only if we're initiator to avoid double-offer races
      pc.onnegotiationneeded = async () => {
        safeLog(
          "pc.onnegotiationneeded, isInitiatorRef:",
          isInitiatorRef.current,
        );
        if (!socketRef.current || !partnerIdRef.current) return;
        // only initiator should create offer here
        if (isInitiatorRef.current !== true) return;
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current.emit("webrtc-offer", {
            offer,
            to: partnerIdRef.current,
          });
          safeLog("negotiationneeded: offer sent");
        } catch (err) {
          safeLog("negotiationneeded error:", err);
        }
      };

      return pc;
    },
    [cleanupPeerConnection],
  );

  // ---------- socket + signaling ----------
  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      safeLog("Socket connected", socket.id);
    });

    socket.on("waiting", () => {
      setIsSearching(true);
    });

    socket.on(
      "match-found",
      async ({ partnerId, partnerUsername, isInitiator, myLocation, partnerLocation }: MatchInfo) => {
        safeLog("match-found", partnerId, partnerUsername, isInitiator, myLocation, partnerLocation);
        setPartnerUsername(partnerUsername);
        partnerUsernameRef.current = partnerUsername;
        isInitiatorRef.current = !!isInitiator;
        
        // Store location data
        if (myLocation) setMyLocationSlug(myLocation);
        if (partnerLocation) setPartnerLocationSlug(partnerLocation);

        // avoid duplicate PC creation: create only if none exists
        const pc = createPeerConnection(partnerId);

        // If we are the initiator, explicitly create and send offer.
        if (isInitiator) {
          try {
            // ensure any previous pending remote candidates cleared
            pendingRemoteCandidatesRef.current = [];
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("webrtc-offer", { offer, to: partnerId });
            safeLog("initiator: offer sent");
          } catch (err) {
            safeLog("Error creating offer:", err);
            setError("Failed to create connection");
          }
        }
      },
    );

    socket.on("webrtc-offer", async ({ offer, from }) => {
      safeLog("webrtc-offer received from", from);
      // If we already have a PC for a different partner, clean it up first.
      if (partnerIdRef.current && partnerIdRef.current !== from) {
        safeLog(
          "offer from new partner while connected to another -> cleanup first",
        );
        cleanupPeerConnection();
      }

      // create or reuse pc
      const pc = peerConnectionRef.current || createPeerConnection(from);

      // mark that we are not the initiator for this session
      isInitiatorRef.current = false;

      try {
        // Guard: if pc is closed, don't attempt
        if (!pc || (pc.signalingState && pc.signalingState === "closed")) {
          safeLog("Received offer but PC is closed — abort");
          return;
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        // apply any queued remote ICE candidates that arrived before remote description was set
        if (pendingRemoteCandidatesRef.current.length > 0) {
          safeLog(
            "adding queued remote candidates:",
            pendingRemoteCandidatesRef.current.length,
          );
          for (const c of pendingRemoteCandidatesRef.current) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (err) {
              // ignore individual candidate failures
            }
          }
          pendingRemoteCandidatesRef.current = [];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit("webrtc-answer", { answer, to: from });
        safeLog("answer sent to", from);
      } catch (err) {
        safeLog("Error handling offer:", err);
        setError("Failed to establish connection");
      }
    });

    socket.on("webrtc-answer", async ({ answer, from }) => {
      safeLog("webrtc-answer from", from);
      try {
        const pc = peerConnectionRef.current;
        if (!pc) {
          safeLog("No PC when answer arrived — ignoring");
          return;
        }
        // Guard for closed PC
        if (pc.signalingState === "closed") {
          safeLog("PC closed when answer arrived — ignoring");
          return;
        }
        await pc.setRemoteDescription(new RTCSessionDescription(answer));

        // apply queued candidates, if any
        if (pendingRemoteCandidatesRef.current.length > 0) {
          safeLog(
            "adding queued remote candidates after answer:",
            pendingRemoteCandidatesRef.current.length,
          );
          for (const c of pendingRemoteCandidatesRef.current) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (err) {
              // ignore
            }
          }
          pendingRemoteCandidatesRef.current = [];
        }
      } catch (err) {
        safeLog("Error handling answer:", err);
      }
    });

    socket.on("webrtc-ice-candidate", async ({ candidate, from }) => {
      // If PC is not ready (no remote desc), queue candidate
      try {
        const pc = peerConnectionRef.current;
        if (!pc) {
          // queue candidate until pc/remoteDesc exists
          pendingRemoteCandidatesRef.current.push(candidate);
          safeLog("queued ICE candidate (no PC yet) from", from);
          return;
        }

        // If the pc is closed, ignore
        if (pc.signalingState === "closed") {
          safeLog("received ICE candidate but PC is closed — ignoring");
          return;
        }

        // If remote description isn't set, queue the candidate
        if (!pc.remoteDescription || pc.remoteDescription.type === "") {
          pendingRemoteCandidatesRef.current.push(candidate);
          safeLog("queued ICE candidate (no remoteDesc) from", from);
          return;
        }

        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          safeLog("added ICE candidate from", from);
        } catch (err) {
          safeLog("Error adding ICE candidate:", err);
        }
      } catch (err) {
        safeLog("ICE candidate handling error:", err);
      }
    });

    socket.on("chat-message", ({ message, from, timestamp }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message,
          isOwn: false,
          username: partnerUsernameRef.current,
          timestamp: new Date(timestamp),
        },
      ]);
    });

    // partner skipped us — cleanup and requeue
    socket.on("partner-skipped", () => {
      safeLog("partner-skipped");
      cleanupPeerConnection();
      setIsSearching(true);
      setError("Partner skipped to next person");
      setTimeout(() => setError(null), 3000);

      // small backoff to avoid race with leftover signaling
      const username =
        currentUsernameRef.current ||
        `User_${Math.floor(Math.random() * 10000)}`;
      requeueTimeoutRef.current = window.setTimeout(() => {
        socket.emit("find-match", username);
      }, 400); // 400ms backoff
    });

    socket.on("partner-disconnected", () => {
      safeLog("partner-disconnected");
      cleanupPeerConnection();
      setIsSearching(true);
      setError("Partner disconnected");
      setTimeout(() => setError(null), 3000);

      const username =
        currentUsernameRef.current ||
        `User_${Math.floor(Math.random() * 10000)}`;
      requeueTimeoutRef.current = window.setTimeout(() => {
        socket.emit("find-match", username);
      }, 400);
    });

    socket.on("match-ended", () => {
      safeLog("match-ended");
      cleanupPeerConnection();
    });

    socket.on("disconnect", (reason: any) => {
      safeLog("socket disconnect:", reason);
      // Keep state: searching false / connected false
      cleanupPeerConnection();
      setIsSearching(false);
    });

    return () => {
      cleanupPeerConnection();
      try {
        socket.disconnect();
      } catch (err) {
        // ignore
      }
      socketRef.current = null;
    };
  }, [createPeerConnection, cleanupPeerConnection]);

  // ---------- init local media ----------
  useEffect(() => {
    let mounted = true;

    async function initLocalStream() {
      try {
        console.log("Requesting camera and microphone access...");
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser doesn't support camera access");
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("Camera access granted, stream:", stream);

        if (mounted) {
          setLocalStream(stream);
          localStreamRef.current = stream;

          // keep initial state for track toggles
          const vt = stream.getVideoTracks()[0];
          const at = stream.getAudioTracks()[0];
          setIsVideoEnabled(!!(vt ? vt.enabled : true));
          setIsAudioEnabled(!!(at ? at.enabled : true));
          
          console.log("Local stream initialized successfully");
        }
      } catch (err: any) {
        console.error("Error accessing media devices:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        
        let errorMessage = "Please allow camera and microphone access";
        
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage = "Camera access denied. Please allow camera permissions and refresh the page.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMessage = "No camera found. Please connect a camera and refresh the page.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMessage = "Camera is being used by another application. Please close other apps and refresh.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera access is not supported in this browser or environment.";
        }
        
        setError(errorMessage);
      }
    }

    initLocalStream();

    return () => {
      mounted = false;
      // stop local tracks on unmount
      try {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
      } catch (err) {
        // ignore
      }
      localStreamRef.current = null;
    };
  }, []);

  // ---------- public actions ----------
  const startSearching = useCallback(
    (username: string, originLocation?: string) => {
      const usernameToUse =
        username || `User_${Math.floor(Math.random() * 10000)}`;
      currentUsernameRef.current = usernameToUse;
      setIsSearching(true);
      setError(null);
      
      // Store my location
      if (originLocation) {
        setMyLocationSlug(originLocation);
        myLocationRef.current = originLocation;
      }

      // ensure existing PC cleaned up before requeueing
      cleanupPeerConnection();

      // slight delay to avoid racing leftover signaling
      setTimeout(() => {
        socketRef.current?.emit("find-match", { 
          username: usernameToUse,
          originLocation: originLocation || null
        });
      }, 300);
    },
    [cleanupPeerConnection],
  );

  const skipPartner = useCallback(() => {
    safeLog("skipPartner called");
    socketRef.current?.emit("skip");
    cleanupPeerConnection();
    setIsSearching(true);
    const username = currentUsernameRef.current;
    const location = myLocationRef.current;
    if (username) {
      // small backoff before re-emit to avoid colliding with late signals
      setTimeout(() => {
        socketRef.current?.emit("find-match", { 
          username,
          originLocation: location || null
        });
      }, 400);
    }
  }, [cleanupPeerConnection]);

  const sendMessage = useCallback((message: string) => {
    if (partnerIdRef.current && socketRef.current) {
      socketRef.current.emit("chat-message", {
        message,
        to: partnerIdRef.current,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message,
          isOwn: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  const toggleAudio = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  return {
    localStream,
    remoteStream,
    isConnected,
    isSearching,
    partnerUsername,
    messages,
    error,
    myLocationSlug,
    partnerLocationSlug,
    startSearching,
    skipPartner,
    sendMessage,
    toggleVideo,
    toggleAudio,
    isVideoEnabled,
    isAudioEnabled,
  };
}
