import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map, ArrowLeft } from "lucide-react";
import { type Location } from "@shared/locations";
import { getSortedAreas } from "@shared/location-helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";

export default function Areas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(100);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const sortedAreas = useMemo(() => getSortedAreas(), []);
  
  const filteredAreas = sortedAreas.filter((area: Location) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, displayLimit);
  
  const hasMore = filteredAreas.length === displayLimit && displayLimit < sortedAreas.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex flex-col pb-24 md:pb-8">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Browse by Area</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Explore {sortedAreas.length.toLocaleString()}+ local regions and neighborhoods
          </p>
          
          <input
            type="text"
            placeholder="Search areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-card border border-card-border text-card-foreground"
            data-testid="input-search-areas"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAreas.map((area: Location) => (
            <Link key={area.slug} href={`/location/area/${area.slug}`}>
              <Card className="hover-elevate transition-all cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{area.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {area.country}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {searchTerm && filteredAreas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No areas found matching "{searchTerm}"</p>
          </div>
        )}
        
        {hasMore && (
          <div className="text-center py-8">
            <Button
              onClick={() => setDisplayLimit(prev => prev + 100)}
              variant="outline"
              size="lg"
              data-testid="button-load-more"
            >
              Load More Areas ({filteredAreas.length} of {sortedAreas.length.toLocaleString()})
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
