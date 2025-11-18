import { getLocationBySlug } from "@shared/locations";
import { generateLocationContent } from "@shared/content-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle2 } from "lucide-react";
import MarriageFAQ from "@/components/MarriageFAQ";
import MarriageGuidance from "@/components/MarriageGuidance";
import PremiumMatchmaking from "@/components/PremiumMatchmaking";

interface LocationContentSectionProps {
  myLocationSlug: string | null;
  partnerLocationSlug: string | null;
}

export default function LocationContentSection({ myLocationSlug, partnerLocationSlug }: LocationContentSectionProps) {
  const myLocation = myLocationSlug ? getLocationBySlug(myLocationSlug) : null;
  const partnerLocation = partnerLocationSlug ? getLocationBySlug(partnerLocationSlug) : null;
  
  const myContent = myLocation ? generateLocationContent(myLocation.name, myLocation.type) : null;
  const partnerContent = partnerLocation ? generateLocationContent(partnerLocation.name, partnerLocation.type) : null;

  if (!myLocation && !partnerLocation) {
    return null;
  }

  return (
    <div className="space-y-8" data-testid="section-location-content">
      {/* Show my location content */}
      {myLocation && myContent && (
        <div className="space-y-6" data-testid={`location-content-${myLocationSlug}`}>
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            <h2 className="text-2xl font-bold">Your Location: {myLocation.name}</h2>
          </div>
          
          {/* Main Content Paragraphs */}
          <div className="space-y-4">
            {myContent.mainContent.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* How-To Guides */}
          {myContent.howToSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {stepIndex + 1}
                      </span>
                      <span className="text-muted-foreground leading-relaxed pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
          
          <PremiumMatchmaking locationName={myLocation.name} />
          <MarriageGuidance />
          <MarriageFAQ />
          
          {/* Tips */}
          <section className="py-8">
            <h3 className="text-xl font-bold mb-4">Pro Tips for the Best Experience</h3>
            <Card>
              <CardContent className="pt-6">
                <ul className="grid gap-3">
                  {myContent.tips.map((tip, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      )}

      {/* Show partner location content */}
      {partnerLocation && partnerContent && partnerLocationSlug !== myLocationSlug && (
        <div className="space-y-6 border-t pt-8" data-testid={`location-content-${partnerLocationSlug}`}>
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            <h2 className="text-2xl font-bold">Partner's Location: {partnerLocation.name}</h2>
          </div>
          
          <PremiumMatchmaking locationName={partnerLocation.name} />
          
          {/* Tips */}
          <section className="py-8">
            <h3 className="text-xl font-bold mb-4">Pro Tips from {partnerLocation.name}</h3>
            <Card>
              <CardContent className="pt-6">
                <ul className="grid gap-3">
                  {partnerContent.tips.map((tip, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}
