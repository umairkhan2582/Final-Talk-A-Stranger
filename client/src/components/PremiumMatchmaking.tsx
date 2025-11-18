import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Crown, 
  Heart, 
  CheckCircle2, 
  Shield, 
  Users, 
  Star,
  Sparkles,
  Clock
} from "lucide-react";

interface PremiumMatchmakingProps {
  locationName: string;
}

export default function PremiumMatchmaking({ locationName }: PremiumMatchmakingProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleUpgradeClick = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 text-sm px-4 py-1 bg-primary text-primary-foreground" data-testid="badge-premium">
              <Crown className="w-4 h-4 mr-1 inline" />
              Premium Feature
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-premium-title">
              Premium Matchmaking Service
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-premium-description">
              Serious about finding a life partner {locationName ? `from ${locationName}` : 'for marriage'}? 
              Our premium matchmaking service connects you with pre-screened candidates who share your values and marriage intentions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover-elevate" data-testid="card-feature-verified">
              <CardHeader>
                <Shield className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Verified Profiles</CardTitle>
                <CardDescription>
                  Every profile is manually verified and screened for serious marriage intentions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-compatibility">
              <CardHeader>
                <Heart className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Compatibility Matching</CardTitle>
                <CardDescription>
                  Advanced matching based on religious values, life goals, and personal preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-family">
              <CardHeader>
                <Users className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Family Involvement</CardTitle>
                <CardDescription>
                  Support for traditional Islamic matchmaking with family consultations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-priority">
              <CardHeader>
                <Sparkles className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Priority Introductions</CardTitle>
                <CardDescription>
                  Get matched with premium members first and receive priority in the queue
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-extended">
              <CardHeader>
                <Clock className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Extended Conversations</CardTitle>
                <CardDescription>
                  Longer video chat sessions to have meaningful discussions about compatibility
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-matchmaker">
              <CardHeader>
                <Star className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Personal Matchmaker</CardTitle>
                <CardDescription>
                  Dedicated matchmaking consultant to guide you through the process
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Benefits List */}
          <Card className="mb-8" data-testid="card-benefits">
            <CardHeader>
              <CardTitle className="text-2xl">What's Included in Premium Matchmaking?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3" data-testid="benefit-screening">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Detailed Profile Screening</div>
                    <p className="text-sm text-muted-foreground">Background verification and intention assessment</p>
                  </div>
                </div>
                <div className="flex gap-3" data-testid="benefit-values">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Islamic Values Filter</div>
                    <p className="text-sm text-muted-foreground">Match with people who share your level of religious commitment</p>
                  </div>
                </div>
                <div className="flex gap-3" data-testid="benefit-location">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Location-Based Matching</div>
                    <p className="text-sm text-muted-foreground">Connect with serious candidates from {locationName || 'your preferred location'}</p>
                  </div>
                </div>
                <div className="flex gap-3" data-testid="benefit-privacy">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Privacy & Discretion</div>
                    <p className="text-sm text-muted-foreground">Your information shared only with compatible matches</p>
                  </div>
                </div>
                <div className="flex gap-3" data-testid="benefit-guidance">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Pre-Marriage Guidance</div>
                    <p className="text-sm text-muted-foreground">Islamic counseling resources and family involvement support</p>
                  </div>
                </div>
                <div className="flex gap-3" data-testid="benefit-support">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Success Support</div>
                    <p className="text-sm text-muted-foreground">Ongoing assistance until you find your match</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card className="max-w-md mx-auto" data-testid="card-pricing">
            <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <CardTitle className="text-3xl mb-2">Premium Matchmaking</CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg">
                Your journey to finding a life partner starts here
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2" data-testid="text-price">
                  Premium
                  <span className="text-2xl text-muted-foreground"> Service</span>
                </div>
                <p className="text-sm text-muted-foreground">Personalized matchmaking support</p>
              </div>
              
              <Button 
                size="lg" 
                className="w-full text-lg"
                onClick={handleUpgradeClick}
                data-testid="button-upgrade-premium"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By upgrading, you'll get immediate access to verified profiles and personalized matchmaking
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-coming-soon">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-secondary p-3">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl" data-testid="text-coming-soon-title">Coming Soon!</DialogTitle>
            <DialogDescription className="text-center text-base" data-testid="text-coming-soon-description">
              We're putting the finishing touches on our Premium Matchmaking service. 
              This feature will be available very soon!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Our team is working hard to create the best halal matchmaking experience. 
              In the meantime, you can continue using our free video chat to meet people from {locationName || 'around the world'}.
            </p>
            <Card className="bg-secondary">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm font-medium text-center mb-2">Want to be notified when we launch?</p>
                <p className="text-xs text-center text-muted-foreground">
                  Check back soon or follow our updates on social media
                </p>
              </CardContent>
            </Card>
            <Button 
              onClick={() => setShowComingSoon(false)} 
              className="w-full"
              data-testid="button-close-coming-soon"
            >
              Continue to Free Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
