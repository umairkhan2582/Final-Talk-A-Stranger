import ChatPanel from '../ChatPanel';
import { useState } from 'react';

export default function ChatPanelExample() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey! Where are you from?', isOwn: false, username: 'Alex_92', timestamp: new Date(Date.now() - 120000) },
    { id: '2', text: "Hi! I'm from California. How about you?", isOwn: true, timestamp: new Date(Date.now() - 60000) },
    { id: '3', text: "Cool! I'm from New York", isOwn: false, username: 'Alex_92', timestamp: new Date() },
  ]);

  const handleSend = (text: string) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      isOwn: true,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="h-[600px] max-w-md border border-border rounded-lg overflow-hidden">
      <ChatPanel 
        messages={messages}
        onSendMessage={handleSend}
        partnerUsername="Alex_92"
      />
    </div>
  );
}
