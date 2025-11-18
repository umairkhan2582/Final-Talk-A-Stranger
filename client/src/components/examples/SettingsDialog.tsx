import SettingsDialog from '../SettingsDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SettingsDialogExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    videoQuality: 'high'
  });

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-settings">
        Open Settings
      </Button>
      <SettingsDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
