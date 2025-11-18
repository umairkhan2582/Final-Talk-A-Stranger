import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Globe, Building2, Map, Info, Shield, FileText, Mail, Home, X } from "lucide-react";
import { getSortedCities, getSortedAreas } from "@shared/location-helpers";
import type { Location } from "@shared/locations";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const menuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      title: "Browse by Country",
      icon: Globe,
      href: "/countries",
      description: "Connect with people from 100+ countries"
    },
    {
      title: "Browse by City",
      icon: Building2,
      href: "/cities",
      description: "Find friends in 490+ major cities"
    },
    {
      title: "Browse by Area",
      icon: Map,
      href: "/areas",
      description: "Explore 9,900+ local regions"
    },
  ];

  // Get international cities and areas for "More" section (already sorted internationally first)
  const internationalCities = getSortedCities().slice(0, 8);
  const internationalAreas = getSortedAreas().slice(0, 8);
  
  const showcaseLocations = [
    ...internationalCities.slice(0, 4).map((city: Location) => ({
      title: city.name,
      icon: Building2,
      href: `/location/city/${city.slug}`,
      type: 'city' as const
    })),
    ...internationalAreas.slice(0, 4).map((area: Location) => ({
      title: area.name,
      icon: MapPin,
      href: `/location/area/${area.slug}`,
      type: 'area' as const
    })),
  ];

  const footerLinks = [
    { title: "Sitemap", icon: FileText, href: "/sitemap" },
    { title: "About Us", icon: Info, href: "/about" },
    { title: "Contact Us", icon: Mail, href: "/contact" },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 bg-card border-card-border p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-card-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              data-testid="button-close-menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
                Main Navigation
              </h3>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a onClick={onClose}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3 hover-elevate"
                      data-testid={`menu-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="flex flex-col items-start text-left">
                        <span className="font-medium">{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        )}
                      </div>
                    </Button>
                  </a>
                </Link>
              ))}
            </div>

            {/* Popular International Locations */}
            <div className="mt-6 pt-6 border-t border-card-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
                Popular Worldwide Locations
              </h3>
              <div className="space-y-1">
                {showcaseLocations.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a onClick={onClose}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start py-2 px-3 hover-elevate"
                        data-testid={`menu-location-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <item.icon className="w-4 h-4 mr-3 text-primary" />
                        <span className="text-sm">{item.title}</span>
                      </Button>
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-card-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
                  More
                </h3>
                {footerLinks.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a onClick={onClose}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start py-2 px-3 hover-elevate"
                        data-testid={`menu-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        <span className="text-sm">{item.title}</span>
                      </Button>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-card-border bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 Talkastranger
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Free Random Video Chat
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
