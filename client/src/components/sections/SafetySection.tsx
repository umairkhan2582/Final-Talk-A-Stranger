import { Card } from "@/components/ui/card";
import { safetyTips } from "@/content/homepage";
import { Shield, Lock, UserX, AlertCircle, Heart, Eye } from "lucide-react";

const icons = [Lock, Shield, AlertCircle, Heart, UserX, Eye];

export default function SafetySection() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto bg-secondary/30 rounded-2xl" data-testid="section-safety">
      <div className="text-center mb-12">
        <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="safety-title">
          Your Safety Matters
        </h2>
        <p className="text-lg text-muted-foreground" data-testid="safety-subtitle">
          Stay safe while making new friends online
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safetyTips.map((tip, index) => {
          const Icon = icons[index];
          return (
            <Card key={index} className="p-6" data-testid={`safety-tip-${index}`}>
              <Icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2" data-testid={`safety-tip-title-${index}`}>{tip.title}</h3>
              <p className="text-muted-foreground" data-testid={`safety-tip-description-${index}`}>{tip.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
