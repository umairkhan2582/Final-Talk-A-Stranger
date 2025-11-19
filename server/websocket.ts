// server/websocket.ts (improved)
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";

interface User {
  socketId: string;
  userId: string;
  username: string;
  country?: string;
  connectedAt: Date;
}

interface Match {
  user1: User;
  user2: User;
  matchId: string;
  matchedAt: Date;
}

class MatchmakingService {
  private waitingUsers: User[] = [];
  private activeMatches: Map<string, Match> = new Map();
  private userToMatch: Map<string, string> = new Map();
  private allConnectedUsers: Map<string, User> = new Map();

  addUser(socketId: string, country?: string): void {
    const user: User = {
      socketId,
      userId: randomUUID(),
      username: "",
      country,
      connectedAt: new Date(),
    };
    this.allConnectedUsers.set(socketId, user);
  }

  getUser(socketId: string): User | undefined {
    return this.allConnectedUsers.get(socketId);
  }

  updateUsername(socketId: string, username: string): User | undefined {
    const u = this.allConnectedUsers.get(socketId);
    if (!u) return undefined;
    u.username =
      username || u.username || `User_${Math.floor(Math.random() * 10000)}`;
    return u;
  }

  addToQueue(user: User): User | null {
    // If there is someone waiting, create a match immediately
    if (this.waitingUsers.length > 0) {
      const partner = this.waitingUsers.shift()!;
      const matchId = randomUUID();

      const match: Match = {
        user1: partner,
        user2: user,
        matchId,
        matchedAt: new Date(),
      };

      this.activeMatches.set(matchId, match);
      this.userToMatch.set(partner.socketId, matchId);
      this.userToMatch.set(user.socketId, matchId);

      return partner;
    } else {
      // otherwise push into waiting queue (use same object)
      this.waitingUsers.push(user);
      return null;
    }
  }

  removeUser(socketId: string): void {
    this.allConnectedUsers.delete(socketId);
    this.waitingUsers = this.waitingUsers.filter(
      (u) => u.socketId !== socketId,
    );
    // also remove any mapping if exists
    const matchId = this.userToMatch.get(socketId);
    if (matchId) {
      this.userToMatch.delete(socketId);
      this.activeMatches.delete(matchId);
      // clear other user's mapping if present
      for (const [sid, mid] of Array.from(this.userToMatch.entries())) {
        if (mid === matchId) this.userToMatch.delete(sid);
      }
    }
  }

  removeFromQueue(socketId: string): void {
    this.waitingUsers = this.waitingUsers.filter(
      (u) => u.socketId !== socketId,
    );
  }

  getStats() {
    const connectedPairs = Array.from(this.activeMatches.values()).map(
      (match) => ({
        user1: { username: match.user1.username, country: match.user1.country },
        user2: { username: match.user2.username, country: match.user2.country },
        matchedAt: match.matchedAt,
      }),
    );

    const waitingUsers = this.waitingUsers.map((u) => ({
      username: u.username,
      country: u.country,
      waitingSince: u.connectedAt,
    }));

    const idleUsers = Array.from(this.allConnectedUsers.values())
      .filter(
        (u) =>
          !this.userToMatch.has(u.socketId) &&
          !this.waitingUsers.find((wu) => wu.socketId === u.socketId),
      )
      .map((u) => ({
        country: u.country,
        connectedAt: u.connectedAt,
      }));

    return {
      totalOnline: this.allConnectedUsers.size,
      connectedPairs,
      waitingUsers,
      idleUsers,
    };
  }

  getMatch(socketId: string): Match | undefined {
    const matchId = this.userToMatch.get(socketId);
    if (!matchId) return undefined;
    return this.activeMatches.get(matchId);
  }

  getPartner(socketId: string): User | undefined {
    const match = this.getMatch(socketId);
    if (!match) return undefined;
    return match.user1.socketId === socketId ? match.user2 : match.user1;
  }

  endMatch(socketId: string): void {
    const matchId = this.userToMatch.get(socketId);
    if (!matchId) return;

    const match = this.activeMatches.get(matchId);
    if (match) {
      // remove both mappings and the match
      this.userToMatch.delete(match.user1.socketId);
      this.userToMatch.delete(match.user2.socketId);
      this.activeMatches.delete(matchId);
    }
  }

  // Requeue a user object if they are still connected and not currently matched
  requeueUser(user: User): User | null {
    // don't requeue someone already matched
    if (this.userToMatch.has(user.socketId)) return null;
    return this.addToQueue(user);
  }
}

export function setupWebSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const matchmaking = new MatchmakingService();

  if (!process.env.ADMIN_PASSWORD) {
    console.error("CRITICAL: ADMIN_PASSWORD environment variable is not set!");
    console.error(
      "Admin dashboard will be disabled. Please set ADMIN_PASSWORD in Replit Secrets.",
    );
  }

  const broadcastStatsToAdmins = () => {
    io.to("admin-room").emit("admin-stats", matchmaking.getStats());
  };

  io.on("connection", async (socket: Socket) => {
    const adminPassword = socket.handshake.query.adminPassword as string;

    if (adminPassword) {
      if (!process.env.ADMIN_PASSWORD) {
        console.log(
          `Admin authentication rejected - ADMIN_PASSWORD not configured: ${socket.id}`,
        );
        socket.emit("admin-authenticated", false);
        socket.emit(
          "admin-error",
          "Admin dashboard is not configured. Contact system administrator.",
        );
        socket.disconnect();
        return;
      }

      const correctPassword = process.env.ADMIN_PASSWORD;

      if (adminPassword === correctPassword) {
        console.log(`Admin authenticated: ${socket.id}`);
        socket.join("admin-room");
        socket.emit("admin-authenticated", true);
        socket.emit("admin-stats", matchmaking.getStats());
        return;
      } else {
        console.log(`Admin authentication failed: ${socket.id}`);
        socket.emit("admin-authenticated", false);
        socket.disconnect();
        return;
      }
    }

    // Get country (best-effort)
    let country = "Unknown";
    try {
      const clientIp =
        socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
      const ip = Array.isArray(clientIp)
        ? clientIp[0]
        : clientIp?.toString() || "";
      if (
        ip &&
        ip !== "::1" &&
        ip !== "127.0.0.1" &&
        !ip.includes("::ffff:127")
      ) {
        const response = await fetch(
          `http://ip-api.com/json/${ip}?fields=country`,
        );
        const data = await response.json();
        if (data?.country) country = data.country;
      }
    } catch (err) {
      console.error("Error getting location:", err);
    }

    console.log(`User connected: ${socket.id} from ${country}`);
    matchmaking.addUser(socket.id, country);

    const broadcastUserCount = () => {
      const stats = matchmaking.getStats();
      io.emit("online-users", stats.totalOnline);
      broadcastStatsToAdmins();
    };

    broadcastUserCount();

    socket.on("find-match", (data: string | { username: string; originLocation?: string | null }) => {
      // Handle both old string format and new object format
      const username = typeof data === 'string' ? data : data.username;
      const originLocation = typeof data === 'object' ? data.originLocation : null;
      
      // Use the stored user object so we don't create duplicates
      let user = matchmaking.getUser(socket.id);
      if (!user) {
        user = {
          socketId: socket.id,
          userId: randomUUID(),
          username: username || `User_${Math.floor(Math.random() * 10000)}`,
          country,
          connectedAt: new Date(),
          originLocation: originLocation || undefined,
        };
        // ensure it's stored
        matchmaking.addUser(socket.id, country);
        matchmaking.updateUsername(socket.id, user.username);
        user = matchmaking.getUser(socket.id)!;
      } else {
        // update username and location on the existing stored object
        matchmaking.updateUsername(socket.id, username || user.username);
        if (originLocation) {
          user.originLocation = originLocation;
        }
      }

      // try to find partner
      const partner = matchmaking.addToQueue(user);

      if (partner) {
        // We keep caller as initiator (same as your original)
        socket.emit("match-found", {
          partnerId: partner.socketId,
          partnerUsername: partner.username,
          isInitiator: true,
          myLocation: user.originLocation || null,
          partnerLocation: partner.originLocation || null,
        });

        // If partner socket is still connected send them the match
        io.to(partner.socketId).emit("match-found", {
          partnerId: socket.id,
          partnerUsername: user.username,
          isInitiator: false,
          myLocation: partner.originLocation || null,
          partnerLocation: user.originLocation || null,
        });

        console.log(`Match created: ${user.username} <-> ${partner.username}`);
        broadcastStatsToAdmins();
      } else {
        socket.emit("waiting");
        console.log(`User ${user.username} added to queue`);
        broadcastStatsToAdmins();
      }
    });

    socket.on("webrtc-offer", ({ offer, to }) => {
      // defensive: only forward if target exists
      if (!to) return;
      io.to(to).emit("webrtc-offer", {
        offer,
        from: socket.id,
      });
    });

    socket.on("webrtc-answer", ({ answer, to }) => {
      if (!to) return;
      io.to(to).emit("webrtc-answer", {
        answer,
        from: socket.id,
      });
    });

    socket.on("webrtc-ice-candidate", ({ candidate, to }) => {
      if (!to) return;
      io.to(to).emit("webrtc-ice-candidate", {
        candidate,
        from: socket.id,
      });
    });

    socket.on("chat-message", ({ message, to }) => {
      // forward only to partner if they match
      const partner = matchmaking.getPartner(socket.id);
      if (partner && partner.socketId === to) {
        io.to(to).emit("chat-message", {
          message,
          from: socket.id,
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on("skip", () => {
      const partner = matchmaking.getPartner(socket.id);

      if (partner) {
        // notify partner that we skipped
        io.to(partner.socketId).emit("partner-skipped");

        // also attempt to requeue the partner defensively server-side:
        // get partner object from store (it is the same object already)
        const partnerObj = matchmaking.getUser(partner.socketId);
        if (partnerObj) {
          const found = matchmaking.requeueUser(partnerObj);
          if (found) {
            // partner got paired immediately with someone else; no further action
          }
        }
      }

      // end this match and notify the skipper
      matchmaking.endMatch(socket.id);
      socket.emit("match-ended");

      console.log(`User ${socket.id} skipped`);
      broadcastStatsToAdmins();
    });

    socket.on("disconnect", () => {
      const partner = matchmaking.getPartner(socket.id);

      if (partner) {
        // notify partner their match is gone
        io.to(partner.socketId).emit("partner-disconnected");

        // try to requeue partner server-side too (defensive)
        const partnerObj = matchmaking.getUser(partner.socketId);
        if (partnerObj) {
          const queuedPartnerResult = matchmaking.requeueUser(partnerObj);
          if (queuedPartnerResult) {
            // partner was requeued (or matched immediately)
          } else {
            // partner remains idle waiting for their client to requeue
          }
        }
      }

      // cleanup all mappings, queue and user record
      matchmaking.removeFromQueue(socket.id);
      matchmaking.endMatch(socket.id);
      matchmaking.removeUser(socket.id);

      console.log(`User disconnected: ${socket.id}`);

      // Slight delay then broadcast updated counts
      setTimeout(() => {
        const stats = matchmaking.getStats();
        io.emit("online-users", stats.totalOnline);
        broadcastStatsToAdmins();
      }, 100);
    });
  });

  console.log("WebSocket server initialized");
  return io;
}
