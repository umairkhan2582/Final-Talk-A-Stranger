interface ChatMessageProps {
  message: string;
  isOwn: boolean;
  username?: string;
  timestamp?: Date;
}

export default function ChatMessage({ message, isOwn, username, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
      {!isOwn && username && (
        <span className="text-xs text-muted-foreground px-3">{username}</span>
      )}
      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] break-words ${
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
        data-testid={`message-${isOwn ? 'own' : 'other'}`}
      >
        <p className="text-sm">{message}</p>
      </div>
      {timestamp && (
        <span className="text-xs text-muted-foreground px-3">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
