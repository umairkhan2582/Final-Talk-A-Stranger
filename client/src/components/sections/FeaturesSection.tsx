import { Card } from "@/components/ui/card";
import { features } from "@/content/homepage";
import { Zap, Sparkles, Shield, Globe, UserCheck, Smartphone } from "lucide-react";

const icons = [Zap, Sparkles, Shield, Globe, UserCheck, Smartphone];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto" data-testid="section-features">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="features-title">
          Why Choose Talkastranger?
        </h2>
        <p className="text-lg text-muted-foreground" data-testid="features-subtitle">
          The best platform for random video chat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = icons[index];
          return (
            <Card key={index} className="p-6" data-testid={`feature-card-${index}`}>
              <Icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2" data-testid={`feature-title-${index}`}>{feature.title}</h3>
              <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
