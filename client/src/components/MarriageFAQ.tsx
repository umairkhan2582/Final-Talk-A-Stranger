import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Users, MessageCircle, Home } from "lucide-react";

const MARRIAGE_FAQS = [
  {
    question: "How can I find a suitable bride on TalkAStranger?",
    answer: "TalkAStranger connects you with people worldwide. When chatting, be respectful, introduce yourself clearly, and express your intentions honestly. Look for someone who shares your values, religious beliefs, and life goals. Take time to know their character and family background through meaningful conversations."
  },
  {
    question: "What's the best way to find a groom through video chat?",
    answer: "Start by having open conversations about faith, family values, and future aspirations. Ask about their career, education, and family background. Video chat allows you to see their mannerisms and communication style. Always involve your family early and seek their guidance throughout the process."
  },
  {
    question: "How do I communicate with a potential spouse's family?",
    answer: "Be respectful, polite, and formal when first meeting the family. Show genuine interest in their culture and traditions. Ask permission before discussing serious topics. Be honest about your background, education, and intentions. Remember that building trust with the family is as important as connecting with your potential spouse."
  },
  {
    question: "What questions should I ask before marriage?",
    answer: "Discuss religious practice and values, career goals and financial expectations, family planning and children, living arrangements preferences, roles and responsibilities in marriage, conflict resolution approaches, and long-term life goals. These conversations help ensure compatibility."
  },
  {
    question: "How can I involve my parents in the process?",
    answer: "Share your conversations with your parents early. Introduce them through video chat once you feel there's potential. Respect their wisdom and experience. Invite them to join discussions about important decisions. Their blessing and involvement create a stronger foundation for your marriage."
  },
  {
    question: "What are Islamic guidelines for online matchmaking?",
    answer: "Maintain proper Islamic etiquette by avoiding private conversations without supervision, being honest and transparent, involving families early, keeping conversations respectful and purposeful, avoiding unnecessary delays once compatibility is confirmed, and always seeking Allah's guidance through Istikhara prayer."
  },
  {
    question: "How do I know if we're compatible for marriage?",
    answer: "Compatibility includes shared religious values and practice level, similar life goals and priorities, mutual respect and communication, family values alignment, compatible temperaments, and agreement on major life decisions. Take time to assess these areas through structured conversations."
  },
  {
    question: "What role should families play in our decision?",
    answer: "Families provide wisdom, experience, and support. They can help assess character, conduct background checks, facilitate proper introductions, provide guidance on compatibility, offer emotional and practical support, and give blessings that strengthen the marriage foundation."
  },
  {
    question: "How long should we talk before deciding on marriage?",
    answer: "There's no fixed timeline, but generally 2-6 months of structured conversations with family involvement is appropriate. Focus on quality of communication rather than duration. Once you've discussed all important topics and families are involved, avoid unnecessary delays."
  },
  {
    question: "What are the essential topics to discuss before engagement?",
    answer: "Essential topics include: religious practice and expectations, financial situation and management, education and career plans, family dynamics and expectations, children and parenting approaches, living location preferences, health and medical history, and any past relationships or commitments."
  },
  {
    question: "How can we ensure our conversations remain Islamic?",
    answer: "Keep a mahram or family member informed, avoid flirtatious or inappropriate talk, focus on getting to know character and compatibility, limit conversation frequency and duration, avoid video chatting alone late at night, and always maintain respect and proper boundaries."
  },
  {
    question: "What if our families have different cultural backgrounds?",
    answer: "Cultural differences can be beautiful when handled with respect. Discuss how you'll blend traditions, which cultural practices are important to maintain, how you'll raise children with both cultures, how you'll handle family gatherings, and ensure both families feel respected and included."
  },
  {
    question: "How do I start a new family after marriage?",
    answer: "Start by establishing your own home and independence while maintaining family ties, set clear boundaries and expectations together, create your own traditions and routines, communicate openly about challenges, support each other's family relationships, and build your marriage on mutual respect and Islamic values."
  },
  {
    question: "What financial discussions should we have?",
    answer: "Discuss current income and debts, savings and financial goals, spending habits and priorities, mahr (dowry) expectations, who will manage household finances, career and work expectations, and how you'll handle financial disagreements. Financial transparency prevents future conflicts."
  },
  {
    question: "How can we involve religious scholars or imams?",
    answer: "Seek guidance from trusted scholars about Islamic marriage requirements, ask them to facilitate family meetings, request their presence during nikah planning, seek advice on resolving disagreements, and ask them to provide premarital counseling. Their guidance ensures your marriage follows Islamic principles."
  },
  {
    question: "What are red flags to watch for while talking?",
    answer: "Warning signs include: unwillingness to involve family, avoiding important questions, inconsistent information, disrespect toward family or religion, pressure to rush the process, reluctance to discuss finances or past, avoiding video calls, or showing anger easily. Trust your instincts and consult family."
  },
  {
    question: "How do we plan the nikah and wedding?",
    answer: "Start with nikah planning: choose an imam, discuss mahr, plan the ceremony, and invite witnesses. For the wedding, agree on budget and size, respect both families' traditions, plan within your means, focus on the marriage not just the event, and ensure everything aligns with Islamic guidelines."
  },
  {
    question: "What if we're from different countries?",
    answer: "Discuss visa and immigration processes early, understand legal requirements for international marriage, plan where you'll live initially, consider career implications for both, discuss how often you'll visit families, learn about each other's culture and language, and prepare for the adjustment period."
  },
  {
    question: "How can we build a strong foundation before marriage?",
    answer: "Build foundation through: honest communication about expectations, shared commitment to Islamic values, mutual respect and kindness, involving and respecting families, premarital Islamic counseling, discussing potential challenges openly, and making dua together for a blessed marriage."
  },
  {
    question: "What resources can help us prepare for marriage?",
    answer: "Utilize Islamic marriage preparation courses, premarital counseling from qualified counselors, books on Islamic marriage, talks by respected scholars, conversations with happily married couples, family guidance and wisdom, and continuous dua for Allah's guidance and blessings."
  }
];

export default function MarriageFAQ() {
  return (
    <section className="px-4 py-12 max-w-4xl mx-auto" data-testid="section-marriage-faq">
      <div className="text-center mb-8">
        <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-3" data-testid="heading-marriage-faq">Islamic Marriage & Family Guidance</h2>
        <p className="text-muted-foreground" data-testid="text-marriage-faq-intro">
          Common questions about finding a spouse and building a family through TalkAStranger
        </p>
      </div>

      <Card className="p-6" data-testid="card-faq-accordion">
        <Accordion type="single" collapsible className="w-full" data-testid="accordion-marriage-faq">
          {MARRIAGE_FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
              <AccordionTrigger 
                className="text-left hover:no-underline"
                data-testid={`button-faq-${index}`}
              >
                <span className="font-semibold" data-testid={`text-faq-question-${index}`}>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent 
                className="text-muted-foreground leading-relaxed"
                data-testid={`text-faq-answer-${index}`}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </section>
  );
}
