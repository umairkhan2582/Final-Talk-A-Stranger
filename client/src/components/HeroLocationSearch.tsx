import { useState, useEffect } from "react";
import { Search, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES, CITIES, AREAS, type Location } from "@shared/locations";
import { Link } from "wouter";

export default function HeroLocationSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestionData, setSuggestionData] = useState({ name: "", details: "" });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const allLocations = [...COUNTRIES, ...CITIES, ...AREAS];
    
    const filtered = allLocations
      .filter(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.slug.toLowerCase().includes(query)
      )
      .slice(0, 5);

    setResults(filtered);
  }, [searchQuery]);

  const handleSuggestionSubmit = () => {
    console.log("Suggestion submitted:", suggestionData);
    alert(`Thank you! We've received your suggestion for "${suggestionData.name}". We'll review it and add it soon!`);
    setShowSuggestionForm(false);
    setSuggestionData({ name: "", details: "" });
    setSearchQuery("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 text-white/70" />
        <Input
          type="text"
          placeholder="Search area, city or country to talk"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 md:pl-16 pr-4 h-16 md:h-20 text-lg md:text-2xl font-medium bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
          data-testid="input-hero-search"
        />
      </div>

      {searchQuery && (
        <Card className="mt-2 bg-white/95 backdrop-blur-md shadow-xl">
          <CardContent className="p-1 md:p-2">
            {results.length > 0 ? (
              <div className="space-y-0.5">
                {results.map((location) => (
                  <Link key={location.slug} href={`/location/${location.type}/${location.slug}`}>
                    <button
                      className="w-full text-left px-3 py-2.5 md:px-4 md:py-3 hover-elevate rounded-md flex items-center gap-2 md:gap-3"
                      data-testid={`result-${location.slug}`}
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm md:text-base">
                          {location.name}
                          {location.country && `, ${location.country}`}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {location.type}
                          {location.city && ` in ${location.city}`}
                        </div>
                      </div>
                    </button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-muted-foreground mb-3">
                  No locations found for "{searchQuery}"
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setSuggestionData({ name: searchQuery, details: "" });
                    setShowSuggestionForm(true);
                  }}
                  data-testid="button-suggest-location"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Desired Area and Start Earning!
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showSuggestionForm} onOpenChange={setShowSuggestionForm}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-suggest-location">
          <DialogHeader>
            <DialogTitle>Create New Location & Start Earning!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location-name">Location Name</Label>
              <Input
                id="location-name"
                value={suggestionData.name}
                onChange={(e) => setSuggestionData({ ...suggestionData, name: e.target.value })}
                placeholder="e.g., Your City Name"
                data-testid="input-suggestion-name"
              />
            </div>
            <div>
              <Label htmlFor="location-details">Additional Details (Optional)</Label>
              <Textarea
                id="location-details"
                value={suggestionData.details}
                onChange={(e) => setSuggestionData({ ...suggestionData, details: e.target.value })}
                placeholder="Tell us about this location..."
                rows={2}
                data-testid="input-suggestion-details"
              />
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-semibold">Payment Required: $10 USDT or $10 worth of TAS Token</p>
                <div className="space-y-1 text-xs">
                  <p className="font-mono break-all"><strong>Wallet:</strong> 0x7765bb6B86Ba85B1145E8F40025f532F97782BeB</p>
                  <p className="font-mono"><strong>Space ID:</strong> theseven.bnb</p>
                  <p className="text-muted-foreground"><strong>Accept:</strong> USDT, TAS Token</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Note:</strong> Payments are not automatically verified. Send $10 USDT or $10 worth of TAS token to the wallet above, then submit your request. We'll manually review and activate within 24 hours after confirming payment.
                </p>
                <p className="text-xs font-medium text-primary mt-2">
                  📧 Support: <a href="mailto:info@talkastranger.com" className="underline hover:text-primary/80">info@talkastranger.com</a>
                </p>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSuggestionSubmit}
                disabled={!suggestionData.name.trim()}
                className="flex-1"
                data-testid="button-submit-suggestion"
              >
                Submit Request
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSuggestionForm(false)}
                data-testid="button-cancel-suggestion"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
