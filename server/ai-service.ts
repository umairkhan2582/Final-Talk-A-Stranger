import OpenAI from "openai";
import pLimit from "p-limit";
import pRetry, { AbortError } from "p-retry";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

export async function generateLocationContent(
  locationType: 'country' | 'city' | 'area',
  locationName: string,
  parentLocation?: string
): Promise<{
  metaDescription: string;
  h1: string;
  h2: string;
  content: string;
  faqs: Array<{ question: string; answer: string }>;
}> {
  const prompt = `Generate unique SEO-optimized content for a random video chat platform called "Talkastranger" targeting users in ${locationName}${parentLocation ? `, ${parentLocation}` : ''}.

The content should emphasize:
- Safe, free random video chat
- Meeting new people from around the world
- No sign up required, instant matching
- 100% free with no tokens or paid features
- Safe and private connections

Please provide the following in JSON format:
{
  "metaDescription": "160 character meta description optimized for SEO",
  "h1": "Main heading that includes the location name",
  "h2": "Subheading describing the service",
  "content": "2-3 paragraphs (200-300 words) describing how Talkastranger connects people in ${locationName} with the world. Make it engaging and location-specific.",
  "faqs": [
    {"question": "FAQ question 1 about video chat in ${locationName}", "answer": "Detailed answer"},
    {"question": "FAQ question 2 about safety", "answer": "Detailed answer"},
    {"question": "FAQ question 3 about features", "answer": "Detailed answer"}
  ]
}`;

  try {
    const response = await pRetry(
      async () => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            max_completion_tokens: 2048,
          });
          const content = completion.choices[0]?.message?.content || "{}";
          return JSON.parse(content);
        } catch (error: any) {
          if (isRateLimitError(error)) {
            throw error;
          }
          throw new AbortError(error);
        }
      },
      {
        retries: 7,
        minTimeout: 2000,
        maxTimeout: 128000,
        factor: 2,
      }
    );
    return response;
  } catch (error) {
    console.error(`Error generating content for ${locationName}:`, error);
    // Return fallback content
    return {
      metaDescription: `Connect with people in ${locationName} through free random video chat on Talkastranger. No sign up, instant match, 100% free and safe.`,
      h1: `Random Video Chat in ${locationName}`,
      h2: `Meet New People Face-to-Face`,
      content: `Talkastranger brings the excitement of random video chat to ${locationName}. Connect instantly with people from around the world through our free, safe, and easy-to-use platform. No sign up required, no tokens, no fees - just pure fun conversations with interesting strangers. Whether you're looking to make new friends, practice languages, or simply have spontaneous conversations, Talkastranger is your gateway to meeting people globally right from ${locationName}.`,
      faqs: [
        { question: `Is Talkastranger free to use in ${locationName}?`, answer: "Yes! Talkastranger is 100% free with no hidden fees, tokens, or premium features. Everyone gets the full experience." },
        { question: "Is it safe to use random video chat?", answer: "We prioritize your safety with built-in reporting tools and community guidelines. Never share personal information and report any inappropriate behavior immediately." },
        { question: "Do I need to sign up?", answer: "No sign up required! Just click 'Start Chatting' and you'll be instantly matched with someone new." }
      ]
    };
  }
}

export async function rewriteNewsArticle(
  originalTitle: string,
  originalContent: string,
  locationName: string
): Promise<{ title: string; content: string }> {
  const prompt = `Rewrite this news article to make it unique and engaging for users in ${locationName}. Keep the core facts but rephrase everything in your own words. Make it concise (2-3 paragraphs, 150-200 words).

Original Title: ${originalTitle}
Original Content: ${originalContent}

Provide response in JSON format:
{
  "title": "Rewritten catchy title",
  "content": "Rewritten article content (2-3 paragraphs)"
}`;

  try {
    const response = await pRetry(
      async () => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            max_completion_tokens: 1024,
          });
          const content = completion.choices[0]?.message?.content || "{}";
          return JSON.parse(content);
        } catch (error: any) {
          if (isRateLimitError(error)) {
            throw error;
          }
          throw new AbortError(error);
        }
      },
      {
        retries: 7,
        minTimeout: 2000,
        maxTimeout: 128000,
        factor: 2,
      }
    );
    return response;
  } catch (error) {
    console.error(`Error rewriting news for ${locationName}:`, error);
    return {
      title: originalTitle,
      content: originalContent
    };
  }
}

export async function batchGenerateLocationContent(
  locations: Array<{ type: 'country' | 'city' | 'area'; name: string; parent?: string }>
): Promise<Awaited<ReturnType<typeof generateLocationContent>>[]> {
  const limit = pLimit(2);
  
  const processingPromises = locations.map((location) =>
    limit(() => generateLocationContent(location.type, location.name, location.parent))
  );
  
  return await Promise.all(processingPromises);
}
