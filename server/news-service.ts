import { rewriteNewsArticle } from "./ai-service";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string };
}

interface LocationNews {
  articles: Array<{
    title: string;
    content: string;
    url: string;
    publishedAt: string;
    source: string;
  }>;
  lastUpdated: Date;
}

const newsCache = new Map<string, LocationNews>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getLocationNews(
  locationName: string,
  locationType: 'country' | 'city' | 'area'
): Promise<LocationNews> {
  const cacheKey = `${locationType}-${locationName}`;
  const cached = newsCache.get(cacheKey);
  
  if (cached && Date.now() - cached.lastUpdated.getTime() < CACHE_DURATION) {
    return cached;
  }

  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    
    if (!newsApiKey) {
      return generateFallbackNews(locationName);
    }

    const query = locationType === 'country' ? locationName : `${locationName} news`;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.articles || data.articles.length === 0) {
      return generateFallbackNews(locationName);
    }

    const rewrittenArticles = await Promise.all(
      data.articles.slice(0, 3).map(async (article: NewsArticle) => {
        const rewritten = await rewriteNewsArticle(
          article.title,
          article.description || article.title,
          locationName
        );
        
        return {
          title: rewritten.title,
          content: rewritten.content,
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source.name
        };
      })
    );

    const result: LocationNews = {
      articles: rewrittenArticles,
      lastUpdated: new Date()
    };

    newsCache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error(`Error fetching news for ${locationName}:`, error);
    return generateFallbackNews(locationName);
  }
}

function generateFallbackNews(locationName: string): LocationNews {
  const today = new Date().toISOString();
  
  return {
    articles: [
      {
        title: `Talkastranger Connects ${locationName} with the World`,
        content: `Residents of ${locationName} are discovering new ways to connect with people globally through free video chat platforms. Talkastranger has emerged as a popular choice for those seeking spontaneous conversations and cultural exchange. The platform's instant matching system allows users to meet people from different countries without any registration or fees. Local users praise the safety features and ease of use.`,
        url: '/',
        publishedAt: today,
        source: 'Talkastranger News'
      },
      {
        title: `The Rise of Video Chat Culture in ${locationName}`,
        content: `Video chat has become an integral part of how people in ${locationName} socialize and make new friends online. With platforms like Talkastranger offering free, anonymous connections, users can practice languages, learn about different cultures, and form meaningful friendships. The trend shows no signs of slowing down as more people seek authentic human connections in the digital age.`,
        url: '/',
        publishedAt: today,
        source: 'Talkastranger News'
      },
      {
        title: `Safe Online Connections: Tips for ${locationName} Users`,
        content: `As video chat platforms grow in popularity across ${locationName}, experts emphasize the importance of online safety. Talkastranger users are encouraged to never share personal information, use the skip button freely, and report any inappropriate behavior. The platform's commitment to user safety includes instant disconnect features and community guidelines that promote respectful interactions worldwide.`,
        url: '/',
        publishedAt: today,
        source: 'Talkastranger News'
      }
    ],
    lastUpdated: new Date()
  };
}
