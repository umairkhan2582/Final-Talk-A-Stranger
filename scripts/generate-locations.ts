import OpenAI from "openai";
import pRetry from "p-retry";
import fs from "node:fs/promises";

// Using Replit AI Integrations - no API key needed, billed to Replit credits
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

// Helper to check rate limit errors
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

// Generate batch of countries (10 at a time)
async function generateCountriesBatch(startIndex: number, batchSize: number): Promise<any[]> {
  const worldCountries = [
    "United States", "China", "India", "Indonesia", "Pakistan", "Brazil", "Nigeria", "Bangladesh", "Russia", "Mexico",
    "Japan", "Ethiopia", "Philippines", "Egypt", "Vietnam", "DR Congo", "Turkey", "Iran", "Germany", "Thailand",
    "United Kingdom", "France", "Italy", "Tanzania", "South Africa", "Myanmar", "Kenya", "South Korea", "Colombia", "Spain",
    "Uganda", "Argentina", "Algeria", "Sudan", "Ukraine", "Iraq", "Afghanistan", "Poland", "Canada", "Morocco",
    "Saudi Arabia", "Uzbekistan", "Peru", "Angola", "Malaysia", "Mozambique", "Ghana", "Yemen", "Nepal", "Venezuela",
    "Madagascar", "Cameroon", "Ivory Coast", "North Korea", "Australia", "Niger", "Taiwan", "Sri Lanka", "Burkina Faso", "Mali",
    "Romania", "Malawi", "Chile", "Kazakhstan", "Zambia", "Guatemala", "Ecuador", "Syria", "Netherlands", "Senegal",
    "Cambodia", "Chad", "Somalia", "Zimbabwe", "Guinea", "Rwanda", "Benin", "Burundi", "Tunisia", "Bolivia",
    "Belgium", "Haiti", "Cuba", "South Sudan", "Dominican Republic", "Czech Republic", "Greece", "Jordan", "Portugal", "Azerbaijan",
    "Sweden", "Honduras", "United Arab Emirates", "Hungary", "Tajikistan", "Belarus", "Austria", "Papua New Guinea", "Serbia", "Israel",
    "Switzerland", "Togo", "Sierra Leone", "Hong Kong", "Laos", "Paraguay", "Bulgaria", "Libya", "Lebanon", "Nicaragua",
    "Kyrgyzstan", "El Salvador", "Turkmenistan", "Singapore", "Denmark", "Finland", "Congo", "Slovakia", "Norway", "Oman",
    "Palestine", "Costa Rica", "Liberia", "Ireland", "Central African Republic", "New Zealand", "Mauritania", "Panama", "Kuwait", "Croatia",
    "Moldova", "Georgia", "Eritrea", "Uruguay", "Bosnia and Herzegovina", "Mongolia", "Armenia", "Jamaica", "Qatar", "Albania",
    "Puerto Rico", "Lithuania", "Namibia", "Gambia", "Botswana", "Gabon", "Lesotho", "North Macedonia", "Slovenia", "Guinea-Bissau",
    "Latvia", "Bahrain", "Equatorial Guinea", "Trinidad and Tobago", "Estonia", "Timor-Leste", "Mauritius", "Cyprus", "Eswatini", "Djibouti",
    "Fiji", "Reunion", "Comoros", "Guyana", "Bhutan", "Solomon Islands", "Macao", "Montenegro", "Luxembourg", "Western Sahara",
    "Suriname", "Cabo Verde", "Maldives", "Malta", "Brunei", "Guadeloupe", "Belize", "Bahamas", "Martinique", "Iceland",
    "Vanuatu", "French Polynesia", "Barbados", "New Caledonia", "French Guiana", "Mayotte", "Samoa", "Saint Lucia", "Curacao",
    "Grenada", "Aruba", "Saint Vincent and the Grenadines", "Kiribati", "Seychelles"
  ];

  const batch = worldCountries.slice(startIndex, startIndex + batchSize);
  
  return pRetry(
    async () => {
      try {
        const prompt = `Generate comprehensive SEO-optimized content for these ${batch.length} countries for Talkastranger video chat platform.

Countries: ${batch.join(', ')}

For EACH country, return detailed JSON with: slug, name, type="country", region, population (string like "X million users"), description, seoTitle, seoDescription, h1, h2, content (3-4 paragraphs), faq (4 Q&A items)

Return ONLY a JSON array with all ${batch.length} countries, no other text.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 8192,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");
        
        const result = JSON.parse(content);
        return Array.isArray(result) ? result : (result.countries || []);
      } catch (error: any) {
        if (isRateLimitError(error)) throw error;
        throw new pRetry.AbortError(error);
      }
    },
    { retries: 5, minTimeout: 2000, maxTimeout: 60000, factor: 2 }
  );
}

async function main() {
  console.log("🚀 Starting location generation using Replit AI Integrations...\n");
  
  try {
    // Ensure directory exists
    await fs.mkdir('./generated', { recursive: true });
    
    // Generate first batch of 10 countries as test
    console.log("📍 Generating first 10 countries...");
    const countriesBatch1 = await generateCountriesBatch(0, 10);
    
    await fs.writeFile(
      './generated/countries-batch1.json',
      JSON.stringify(countriesBatch1, null, 2)
    );
    
    console.log(`✅ Generated ${countriesBatch1.length} countries`);
    console.log("Saved to scripts/generated/countries-batch1.json");
    
    console.log("\n🎉 Test generation complete!");
    console.log("Review the output and run again to generate more batches.");
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
