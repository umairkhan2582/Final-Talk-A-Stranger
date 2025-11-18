import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, User } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import tassyMascot from "@assets/generated_images/TASSY_mascot_character_design_a24f8778.png";

interface HeaderProps {
  onMenuClick?: () => void;
  onStartChat?: () => void;
  onProfileClick?: () => void;
  isConnected?: boolean;
  userName?: string;
}

export default function Header({
  onMenuClick,
  onStartChat,
  onProfileClick,
  isConnected = false,
  userName,
}: HeaderProps) {
  const [, setLocation] = useLocation();

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat();
    } else {
      setLocation("/?autostart=true");
    }
  };

  const handleLogoClick = () => {
    setLocation("/");
  };

  // Get initials from username
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg p-2 -ml-2"
          data-testid="header-logo"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
            <img 
              src={tassyMascot} 
              alt="TASSY Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">
              Talkastranger
            </span>
            <span className="text-xs text-muted-foreground">Video Chat</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={onProfileClick}
            className="hover-elevate active-elevate-2 rounded-full"
            data-testid="button-profile"
          >
            <Avatar className="h-9 w-9" data-testid="header-profile-avatar">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </button>

          <Button
            variant="default"
            size="sm"
            onClick={handleStartChat}
            data-testid="header-start-chat"
          >
            {isConnected ? "Next" : "Start Chat"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            data-testid="header-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
