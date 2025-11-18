import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COUNTRIES, CITIES, AREAS, type Location } from "@shared/locations";
import { MapPin, Building2, Map, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Sitemap() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex flex-col pb-24 md:pb-8">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Sitemap</h1>
          <p className="text-muted-foreground text-lg">
            Navigate all {(COUNTRIES.length + CITIES.length + AREAS.length).toLocaleString()}+ pages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Countries ({COUNTRIES.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {COUNTRIES.map((country: Location) => (
                  <Link key={country.slug} href={`/location/country/${country.slug}`}>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      {country.name}
                    </Button>
                  </Link>
                ))}
              </div>
              <Link href="/countries">
                <Button className="w-full mt-4" variant="outline">
                  View All Countries
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Cities ({CITIES.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {CITIES.slice(0, 50).map((city: Location) => (
                  <Link key={city.slug} href={`/location/city/${city.slug}`}>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      {city.name}
                    </Button>
                  </Link>
                ))}
                {CITIES.length > 50 && (
                  <p className="text-sm text-muted-foreground col-span-2 text-center mt-2">
                    + {CITIES.length - 50} more cities
                  </p>
                )}
              </div>
              <Link href="/cities">
                <Button className="w-full mt-4" variant="outline">
                  View All Cities
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Areas & Regions ({AREAS.length.toLocaleString()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                {AREAS.slice(0, 100).map((area: Location) => (
                  <Link key={area.slug} href={`/location/area/${area.slug}`}>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      {area.name}
                    </Button>
                  </Link>
                ))}
                {AREAS.length > 100 && (
                  <p className="text-sm text-muted-foreground col-span-2 md:col-span-4 text-center mt-2">
                    + {(AREAS.length - 100).toLocaleString()} more areas
                  </p>
                )}
              </div>
              <Link href="/areas">
                <Button className="w-full mt-4" variant="outline">
                  View All Areas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Browse All Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/countries">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-bold">All Countries</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{COUNTRIES.length} locations</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/cities">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="font-bold">All Cities</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{CITIES.length} locations</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/areas">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-primary" />
                      <span className="font-bold">All Areas</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{AREAS.length.toLocaleString()} locations</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
