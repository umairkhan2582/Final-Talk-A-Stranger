import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatTimerProps {
  startTime?: number;
  isActive?: boolean;
}

export default function ChatTimer({ startTime, isActive = true }: ChatTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full" data-testid="timer-display">
      <Clock className="w-4 h-4 text-white" />
      <span className="font-mono text-sm font-medium text-white">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}
