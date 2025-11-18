import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: {
    darkMode: boolean;
    notifications: boolean;
    videoQuality: string;
  };
  onSettingsChange?: (settings: any) => void;
}

export default function SettingsDialog({ 
  isOpen, 
  onClose,
  settings = {
    darkMode: false,
    notifications: true,
    videoQuality: 'high'
  },
  onSettingsChange
}: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your chat experience
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col gap-1">
              <span>Dark Mode</span>
              <span className="text-xs text-muted-foreground font-normal">
                Switch to dark theme
              </span>
            </Label>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => {
                onSettingsChange?.({ ...settings, darkMode: checked });
                console.log('Dark mode:', checked);
              }}
              data-testid="switch-dark-mode"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex flex-col gap-1">
              <span>Notifications</span>
              <span className="text-xs text-muted-foreground font-normal">
                Get notified on new matches
              </span>
            </Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => {
                onSettingsChange?.({ ...settings, notifications: checked });
                console.log('Notifications:', checked);
              }}
              data-testid="switch-notifications"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="video-quality">Video Quality</Label>
            <Select 
              value={settings.videoQuality}
              onValueChange={(value) => {
                onSettingsChange?.({ ...settings, videoQuality: value });
                console.log('Video quality:', value);
              }}
            >
              <SelectTrigger id="video-quality" data-testid="select-video-quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Save data)</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High (Best quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} data-testid="button-close-settings">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
