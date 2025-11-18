import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { homepageFAQs } from "@/content/homepage";

export default function FAQSection() {
  return (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about Talkastranger
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {homepageFAQs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger data-testid={`faq-question-${index}`}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent data-testid={`faq-answer-${index}`}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
