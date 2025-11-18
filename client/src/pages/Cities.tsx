import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import { type Location } from "@shared/locations";
import { getSortedCities } from "@shared/location-helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";

export default function Cities() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sortedCities = useMemo(() => getSortedCities(), []);
  
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
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Browse by City</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find friends in {sortedCities.length} major cities around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedCities.map((city: Location) => (
            <Link key={city.slug} href={`/location/city/${city.slug}`}>
              <Card className="hover-elevate transition-all cursor-pointer h-full">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {city.country}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
