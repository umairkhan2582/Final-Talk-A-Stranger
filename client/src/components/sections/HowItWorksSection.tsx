import { Card } from "@/components/ui/card";
import { howItWorksSteps } from "@/content/homepage";
import { Camera, Users, MessageCircle, SkipForward } from "lucide-react";

const icons = [Camera, Users, MessageCircle, SkipForward];

export default function HowItWorksSection() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto" data-testid="section-how-it-works">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="how-it-works-title">
          How It Works
        </h2>
        <p className="text-lg text-muted-foreground" data-testid="how-it-works-subtitle">
          Start chatting in 4 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {howItWorksSteps.map((step, index) => {
          const Icon = icons[index];
          return (
            <Card key={step.step} className="p-6 text-center" data-testid={`how-it-works-step-${step.step}`}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid={`step-number-${step.step}`}>
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-2" data-testid={`step-title-${step.step}`}>{step.title}</h3>
              <p className="text-muted-foreground" data-testid={`step-description-${step.step}`}>{step.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
