import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Copy, X, Calendar, MapPin } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const userId = Math.floor(Math.random() * 999999999).toString();
  
  const copyId = () => {
    navigator.clipboard.writeText(userId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-card-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">My Profile</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              data-testid="button-close-profile"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Card className="p-4 bg-secondary border-secondary-foreground/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">Guest User</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>ID: {userId}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyId}
                    className="h-6 w-6"
                    data-testid="button-copy-id"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary border-secondary-foreground/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Birthday</span>
              </div>
              <span className="text-muted-foreground">Not set</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Gender</span>
              </div>
              <span className="text-muted-foreground">Not set</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Location</span>
              </div>
              <span className="text-muted-foreground">Worldwide</span>
            </div>
          </Card>

          <p className="text-xs text-muted-foreground text-center px-4">
            Create an account to save your preferences and chat history
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
