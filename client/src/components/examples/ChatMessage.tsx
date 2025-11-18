import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-background max-w-md">
      <ChatMessage 
        message="Hey! Where are you from?"
        isOwn={false}
        username="Alex_92"
        timestamp={new Date(Date.now() - 120000)}
      />
      <ChatMessage 
        message="Hi! I'm from California. How about you?"
        isOwn={true}
        timestamp={new Date(Date.now() - 60000)}
      />
      <ChatMessage 
        message="Cool! I'm from New York 🗽"
        isOwn={false}
        username="Alex_92"
        timestamp={new Date()}
      />
    </div>
  );
}
