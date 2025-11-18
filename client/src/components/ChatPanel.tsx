import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  username?: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  partnerUsername?: string;
}

export default function ChatPanel({ 
  isOpen = true, 
  onClose,
  messages = [],
  onSendMessage,
  partnerUsername = "Stranger"
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue);
      console.log('Send message:', inputValue);
      setInputValue("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-lg border-l border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Chat</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            onClose?.();
            console.log('Close chat');
          }}
          data-testid="button-close-chat"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="flex flex-col gap-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.text}
              isOwn={msg.isOwn}
              username={msg.isOwn ? undefined : msg.username || partnerUsername}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputValue.trim()}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
