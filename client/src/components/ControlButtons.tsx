import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, SkipForward, Flag, Settings, Users } from "lucide-react";
import { useState } from "react";

interface ControlButtonsProps {
  onNext?: () => void;
  onReport?: () => void;
  onSettings?: () => void;
  onGenderFilter?: () => void;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  onToggleVideo?: () => void;
  onToggleAudio?: () => void;
}

export default function ControlButtons({
  onNext,
  onReport,
  onSettings,
  onGenderFilter,
  isVideoEnabled = true,
  isAudioEnabled = true,
  onToggleVideo,
  onToggleAudio,
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          onToggleAudio?.();
          console.log('Toggle audio');
        }}
        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        data-testid="button-toggle-audio"
      >
        {isAudioEnabled ? (
          <Mic className="w-5 h-5 text-white" />
        ) : (
          <MicOff className="w-5 h-5 text-white" />
        )}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          onToggleVideo?.();
          console.log('Toggle video');
        }}
        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        data-testid="button-toggle-video"
      >
        {isVideoEnabled ? (
          <Video className="w-5 h-5 text-white" />
        ) : (
          <VideoOff className="w-5 h-5 text-white" />
        )}
      </Button>

      <Button
        size="icon"
        onClick={() => {
          onNext?.();
          console.log('Next person');
        }}
        className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        data-testid="button-next"
      >
        <SkipForward className="w-6 h-6 text-primary-foreground" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          onReport?.();
          console.log('Report user');
        }}
        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        data-testid="button-report"
      >
        <Flag className="w-5 h-5 text-white" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          onGenderFilter?.();
          console.log('Open gender filter');
        }}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/50 animate-pulse"
        data-testid="button-gender-filter"
      >
        <Users className="w-6 h-6 text-white drop-shadow-lg" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          onSettings?.();
          console.log('Open settings');
        }}
        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
        data-testid="button-settings"
      >
        <Settings className="w-5 h-5 text-white" />
      </Button>
    </div>
  );
}
