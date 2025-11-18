import { aboutContent } from "@/content/homepage";
import { Globe2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="px-4 py-16 max-w-5xl mx-auto" data-testid="section-about">
      <div className="text-center mb-12">
        <Globe2 className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="about-title">
          {aboutContent.title}
        </h2>
      </div>

      <div className="space-y-6 text-lg leading-relaxed">
        {aboutContent.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-foreground" data-testid={`about-paragraph-${index}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
