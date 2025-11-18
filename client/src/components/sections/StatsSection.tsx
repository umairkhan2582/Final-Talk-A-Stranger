import { stats } from "@/content/homepage";
import { Card } from "@/components/ui/card";

export default function StatsSection() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto" data-testid="section-stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 text-center" data-testid={`stat-card-${index}`}>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2" data-testid={`stat-value-${index}`}>
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-semibold" data-testid={`stat-label-${index}`}>
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
