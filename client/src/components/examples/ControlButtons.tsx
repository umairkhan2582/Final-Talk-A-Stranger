import ControlButtons from '../ControlButtons';
import { useState } from 'react';

export default function ControlButtonsExample() {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 to-accent/20">
      <ControlButtons
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
      />
    </div>
  );
}
