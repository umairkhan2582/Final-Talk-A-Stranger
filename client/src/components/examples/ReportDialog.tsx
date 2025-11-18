import ReportDialog from '../ReportDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ReportDialogExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)} variant="destructive" data-testid="button-open-report">
        Report User
      </Button>
      <ReportDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
