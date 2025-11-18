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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, details: string) => void;
}

export default function ReportDialog({ isOpen, onClose, onSubmit }: ReportDialogProps) {
  const [reason, setReason] = useState("inappropriate");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    onSubmit?.(reason, details);
    console.log('Report submitted:', { reason, details });
    setDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report User</DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting inappropriate behavior
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label>Reason for reporting</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate" id="inappropriate" data-testid="radio-inappropriate" />
                <Label htmlFor="inappropriate" className="font-normal">
                  Inappropriate content
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment" id="harassment" data-testid="radio-harassment" />
                <Label htmlFor="harassment" className="font-normal">
                  Harassment or bullying
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" data-testid="radio-spam" />
                <Label htmlFor="spam" className="font-normal">
                  Spam or scam
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="underage" id="underage" data-testid="radio-underage" />
                <Label htmlFor="underage" className="font-normal">
                  Appears to be underage
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" data-testid="radio-other" />
                <Label htmlFor="other" className="font-normal">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide more information about the issue..."
              className="resize-none"
              rows={4}
              data-testid="textarea-report-details"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-report">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} data-testid="button-submit-report">
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
