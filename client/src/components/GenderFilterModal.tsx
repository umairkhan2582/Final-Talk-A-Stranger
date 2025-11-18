import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface GenderFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGender: (gender: 'male' | 'female' | 'all') => void;
}

export default function GenderFilterModal({ isOpen, onClose, onSelectGender }: GenderFilterModalProps) {
  // Persist payment confirmation in localStorage
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Sync with localStorage whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentConfirmed(localStorage.getItem('gender_filter_paid') === 'true');
    }
  }, [isOpen]);

  const handlePaymentCheck = (checked: boolean) => {
    setPaymentConfirmed(checked);
    localStorage.setItem('gender_filter_paid', checked ? 'true' : 'false');
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'all') => {
    if (gender === 'all' || paymentConfirmed) {
      onSelectGender(gender);
      onClose();
    } else {
      alert("Please confirm payment first by checking the box below.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 border-2 border-purple-300 dark:border-purple-700" data-testid="dialog-gender-filter">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            🎯 Choose Your Match
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">
            Filter by gender and connect with exactly who you want to meet!
          </p>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="flex flex-col h-28 gap-2 border-2 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 transition-transform"
              onClick={() => handleGenderSelect('male')}
              data-testid="button-filter-boys"
            >
              <div className="text-4xl">👦</div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Boys Only</span>
              <span className="text-xs text-muted-foreground">Premium</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-28 gap-2 border-2 border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950 hover:scale-105 transition-transform"
              onClick={() => handleGenderSelect('female')}
              data-testid="button-filter-girls"
            >
              <div className="text-4xl">👧</div>
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400">Girls Only</span>
              <span className="text-xs text-muted-foreground">Premium</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-28 gap-2 border-2 border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 hover:scale-105 transition-transform"
              onClick={() => handleGenderSelect('all')}
              data-testid="button-filter-all"
            >
              <div className="text-4xl">🌟</div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Everyone</span>
              <span className="text-xs text-green-600 dark:text-green-400 font-bold">FREE</span>
            </Button>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold">Payment: $10 USDT or $10 worth of TAS Token</p>
              <div className="space-y-1 text-xs">
                <p className="font-mono break-all"><strong>Wallet:</strong> 0x7765bb6B86Ba85B1145E8F40025f532F97782BeB</p>
                <p className="font-mono"><strong>Space ID:</strong> theseven.bnb</p>
                <p className="text-muted-foreground"><strong>Accept:</strong> USDT, TAS Token</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Note:</strong> Send $10 USDT or $10 worth of TAS token. Payments are not automatically verified. After sending payment, check the box below to activate your filter.
              </p>
              <p className="text-xs font-medium text-primary mt-2">
                📧 Support: <a href="mailto:info@talkastranger.com" className="underline hover:text-primary/80">info@talkastranger.com</a>
              </p>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="payment-confirmed" 
                  checked={paymentConfirmed}
                  onCheckedChange={(checked) => handlePaymentCheck(checked === true)}
                  data-testid="checkbox-payment-confirmed"
                />
                <Label htmlFor="payment-confirmed" className="text-xs cursor-pointer">
                  I have sent the payment
                </Label>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            data-testid="button-close-gender-filter"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
