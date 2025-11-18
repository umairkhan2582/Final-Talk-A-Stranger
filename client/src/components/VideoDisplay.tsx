import { Video, VideoOff } from "lucide-react";
import { useState } from "react";

interface VideoDisplayProps {
  stream?: MediaStream | null;
  isMuted?: boolean;
  isLocalVideo?: boolean;
  username?: string;
  className?: string;
}

export default function VideoDisplay({ 
  stream, 
  isMuted = false, 
  isLocalVideo = false,
  username,
  className = ""
}: VideoDisplayProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative bg-muted rounded-2xl overflow-hidden ${className}`}>
      {stream && !hasError ? (
        <video
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream;
            }
          }}
          autoPlay
          playsInline
          muted={isMuted || isLocalVideo}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-secondary">
          {hasError ? (
            <VideoOff className="w-12 h-12 text-muted-foreground" />
          ) : (
            <Video className="w-12 h-12 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {hasError ? "Camera unavailable" : "No video"}
          </p>
        </div>
      )}
      
      {username && (
        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
          <p className="text-xs font-medium text-white">{username}</p>
        </div>
      )}
    </div>
  );
}
