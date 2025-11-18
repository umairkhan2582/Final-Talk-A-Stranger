import { useLocation } from "wouter";
import { Home, Video, MapPin, Menu } from "lucide-react";

interface MobileFooterProps {
  onStartChat?: () => void;
}

export default function MobileFooter({ onStartChat }: MobileFooterProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        <button
          onClick={() => setLocation("/")}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover-elevate active-elevate-2"
          data-testid="footer-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={onStartChat}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover-elevate active-elevate-2"
          data-testid="footer-chat"
        >
          <Video className="w-5 h-5" />
          <span className="text-xs">Talk Now</span>
        </button>

        <button
          onClick={() => setLocation("/countries")}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover-elevate active-elevate-2"
          data-testid="footer-locations"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-xs">Locations</span>
        </button>

        <button
          onClick={() => setLocation("/sitemap")}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover-elevate active-elevate-2"
          data-testid="footer-more"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
}
