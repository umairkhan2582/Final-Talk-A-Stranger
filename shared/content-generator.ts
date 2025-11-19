// Content generation for location pages using diverse marriage/relationship guidance
import { 
  getRandomMarriageContent, 
  getRandomMarriageTips, 
  getRandomMarriageFaqs 
} from './marriage-content-library';

export interface LocationContent {
  mainContent: string[];
  howToSections: Array<{ title: string; steps: string[] }>;
  tips: string[];
  additionalFaq: Array<{ question: string; answer: string }>;
}

export function generateLocationContent(name: string, type: 'country' | 'city' | 'area'): LocationContent {
  const locationLabel = type === 'country' ? `in ${name}` : `from ${name}`;
  
  // Get random marriage guidance articles (6 for more SEO content)
  const marriageArticles = getRandomMarriageContent(6);
  
  // Combine marriage content with location-specific intro
  const mainContent = [
    `Connect with people ${locationLabel} through Talkastranger's video chat platform. Whether you're seeking meaningful conversations, cultural exchange, or exploring the possibility of finding a life partner, our platform brings together individuals ${locationLabel} who share your interests and values.`,
    ...marriageArticles.flatMap(article => article.content)
  ];
  
  // Convert marriage articles to how-to sections format
  const howToSections = marriageArticles
    .filter(article => article.type === 'howto')
    .map(article => ({
      title: article.title,
      steps: article.content
    }));
  
  // If we don't have enough how-to articles, add some location-specific guides
  if (howToSections.length < 2) {
    howToSections.push({
      title: `How to Make Meaningful Connections ${locationLabel}`,
      steps: [
        `Visit Talkastranger's ${name} community page and start with a clear intention`,
        "Allow camera and microphone access to enable face-to-face conversations",
        "Greet new connections with respect and genuine interest in getting to know them",
        "Discuss shared interests, values, and what you're looking for in meaningful relationships",
        "For serious marriage intentions, consider upgrading to Premium Matchmaking for pre-screened candidates",
        "Maintain appropriate boundaries and Islamic etiquette in all conversations",
        "Exchange contact information only when both parties feel comfortable and intentions are clear"
      ]
    });
  }
  
  // Get random marriage tips (more for SEO)
  const tips = getRandomMarriageTips(20);
  
  // Get random marriage FAQs (more for SEO)
  const additionalFaq = getRandomMarriageFaqs(10);
  
  return {
    mainContent,
    howToSections,
    tips,
    additionalFaq
  };
}
