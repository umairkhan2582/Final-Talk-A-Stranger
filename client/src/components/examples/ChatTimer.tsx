import ChatTimer from '../ChatTimer';

export default function ChatTimerExample() {
  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 to-accent/20">
      <ChatTimer startTime={Date.now() - 45000} isActive />
    </div>
  );
}
