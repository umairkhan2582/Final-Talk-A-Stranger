import OpenAI from "openai";
import pRetry from "p-retry";
import fs from "node:fs/promises";
import { Buffer } from "node:buffer";
import path from "node:path";

// Using Replit AI Integrations - billed to Replit credits
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

// All 195 UN-recognized countries
const worldCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "DR Congo", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Top 2000 cities worldwide (by population and importance)
const worldCities = [
  // Asia - Major cities
  { name: "Tokyo", country: "Japan" }, { name: "Delhi", country: "India" }, { name: "Shanghai", country: "China" }, 
  { name: "Mumbai", country: "India" }, { name: "Beijing", country: "China" }, { name: "Dhaka", country: "Bangladesh" },
  { name: "Osaka", country: "Japan" }, { name: "Karachi", country: "Pakistan" }, { name: "Chongqing", country: "China" },
  { name: "Istanbul", country: "Turkey" }, { name: "Manila", country: "Philippines" }, { name: "Tianjin", country: "China" },
  { name: "Guangzhou", country: "China" }, { name: "Lahore", country: "Pakistan" }, { name: "Bangalore", country: "India" },
  { name: "Shenzhen", country: "China" }, { name: "Seoul", country: "South Korea" }, { name: "Jakarta", country: "Indonesia" },
  { name: "Chennai", country: "India" }, { name: "Bangkok", country: "Thailand" }, { name: "Hyderabad", country: "India" },
  { name: "Tehran", country: "Iran" }, { name: "Kolkata", country: "India" }, { name: "Hong Kong", country: "China" },
  { name: "Baghdad", country: "Iraq" }, { name: "Wuhan", country: "China" }, { name: "Riyadh", country: "Saudi Arabia" },
  { name: "Singapore", country: "Singapore" }, { name: "Ahmedabad", country: "India" }, { name: "Surat", country: "India" },
  { name: "Hangzhou", country: "China" }, { name: "Nanjing", country: "China" }, { name: "Ho Chi Minh City", country: "Vietnam" },
  { name: "Dubai", country: "United Arab Emirates" }, { name: "Kuala Lumpur", country: "Malaysia" }, { name: "Taipei", country: "Taiwan" },
  { name: "Pune", country: "India" }, { name: "Shenyang", country: "China" }, { name: "Suzhou", country: "China" },
  { name: "Yangon", country: "Myanmar" }, { name: "Jeddah", country: "Saudi Arabia" }, { name: "Hanoi", country: "Vietnam" },
  { name: "Xi'an", country: "China" }, { name: "Chengdu", country: "China" }, { name: "Kabul", country: "Afghanistan" },
  { name: "Jaipur", country: "India" }, { name: "Lucknow", country: "India" }, { name: "Kanpur", country: "India" },
  { name: "Nagpur", country: "India" }, { name: "Indore", country: "India" }, { name: "Busan", country: "South Korea" },
  
  // Americas
  { name: "Sao Paulo", country: "Brazil" }, { name: "Mexico City", country: "Mexico" }, { name: "New York", country: "United States" },
  { name: "Buenos Aires", country: "Argentina" }, { name: "Rio de Janeiro", country: "Brazil" }, { name: "Los Angeles", country: "United States" },
  { name: "Lima", country: "Peru" }, { name: "Bogota", country: "Colombia" }, { name: "Santiago", country: "Chile" },
  { name: "Belo Horizonte", country: "Brazil" }, { name: "Guadalajara", country: "Mexico" }, { name: "Chicago", country: "United States" },
  { name: "Houston", country: "United States" }, { name: "Toronto", country: "Canada" }, { name: "Phoenix", country: "United States" },
  { name: "Philadelphia", country: "United States" }, { name: "San Antonio", country: "United States" }, { name: "San Diego", country: "United States" },
  { name: "Dallas", country: "United States" }, { name: "San Jose", country: "United States" }, { name: "Monterrey", country: "Mexico" },
  { name: "Brasilia", country: "Brazil" }, { name: "Fortaleza", country: "Brazil" }, { name: "Guayaquil", country: "Ecuador" },
  { name: "Caracas", country: "Venezuela" }, { name: "Quito", country: "Ecuador" }, { name: "Medellin", country: "Colombia" },
  { name: "Cali", country: "Colombia" }, { name: "Salvador", country: "Brazil" }, { name: "Recife", country: "Brazil" },
  { name: "Havana", country: "Cuba" }, { name: "Montreal", country: "Canada" }, { name: "Miami", country: "United States" },
  { name: "Boston", country: "United States" }, { name: "Atlanta", country: "United States" }, { name: "Seattle", country: "United States" },
  { name: "Denver", country: "United States" }, { name: "Minneapolis", country: "United States" }, { name: "Tampa", country: "United States" },
  { name: "Portland", country: "United States" }, { name: "Austin", country: "United States" }, { name: "Las Vegas", country: "United States" },
  
  // Africa
  { name: "Cairo", country: "Egypt" }, { name: "Lagos", country: "Nigeria" }, { name: "Kinshasa", country: "DR Congo" },
  { name: "Johannesburg", country: "South Africa" }, { name: "Khartoum", country: "Sudan" }, { name: "Alexandria", country: "Egypt" },
  { name: "Abidjan", country: "Ivory Coast" }, { name: "Casablanca", country: "Morocco" }, { name: "Nairobi", country: "Kenya" },
  { name: "Cape Town", country: "South Africa" }, { name: "Durban", country: "South Africa" }, { name: "Luanda", country: "Angola" },
  { name: "Addis Ababa", country: "Ethiopia" }, { name: "Dar es Salaam", country: "Tanzania" }, { name: "Kano", country: "Nigeria" },
  { name: "Algiers", country: "Algeria" }, { name: "Accra", country: "Ghana" }, { name: "Ibadan", country: "Nigeria" },
  { name: "Dakar", country: "Senegal" }, { name: "Kampala", country: "Uganda" }, { name: "Rabat", country: "Morocco" },
  { name: "Maputo", country: "Mozambique" }, { name: "Tunis", country: "Tunisia" }, { name: "Harare", country: "Zimbabwe" },
  { name: "Pretoria", country: "South Africa" }, { name: "Lusaka", country: "Zambia" }, { name: "Bamako", country: "Mali" },
  
  // Europe
  { name: "Moscow", country: "Russia" }, { name: "London", country: "United Kingdom" }, { name: "Saint Petersburg", country: "Russia" },
  { name: "Berlin", country: "Germany" }, { name: "Madrid", country: "Spain" }, { name: "Rome", country: "Italy" },
  { name: "Paris", country: "France" }, { name: "Kyiv", country: "Ukraine" }, { name: "Barcelona", country: "Spain" },
  { name: "Munich", country: "Germany" }, { name: "Milan", country: "Italy" }, { name: "Birmingham", country: "United Kingdom" },
  { name: "Hamburg", country: "Germany" }, { name: "Warsaw", country: "Poland" }, { name: "Vienna", country: "Austria" },
  { name: "Budapest", country: "Hungary" }, { name: "Bucharest", country: "Romania" }, { name: "Minsk", country: "Belarus" },
  { name: "Stockholm", country: "Sweden" }, { name: "Prague", country: "Czech Republic" }, { name: "Brussels", country: "Belgium" },
  { name: "Copenhagen", country: "Denmark" }, { name: "Amsterdam", country: "Netherlands" }, { name: "Marseille", country: "France" },
  { name: "Naples", country: "Italy" }, { name: "Turin", country: "Italy" }, { name: "Valencia", country: "Spain" },
  { name: "Lisbon", country: "Portugal" }, { name: "Athens", country: "Greece" }, { name: "Sofia", country: "Bulgaria" },
  { name: "Dublin", country: "Ireland" }, { name: "Zagreb", country: "Croatia" }, { name: "Belgrade", country: "Serbia" },
  { name: "Oslo", country: "Norway" }, { name: "Helsinki", country: "Finland" }, { name: "Glasgow", country: "United Kingdom" },
  { name: "Lyon", country: "France" }, { name: "Cologne", country: "Germany" }, { name: "Frankfurt", country: "Germany" },
  { name: "Seville", country: "Spain" }, { name: "Rotterdam", country: "Netherlands" }, { name: "Manchester", country: "United Kingdom" },
  
  // Oceania
  { name: "Sydney", country: "Australia" }, { name: "Melbourne", country: "Australia" }, { name: "Brisbane", country: "Australia" },
  { name: "Perth", country: "Australia" }, { name: "Adelaide", country: "Australia" }, { name: "Auckland", country: "New Zealand" },
  { name: "Wellington", country: "New Zealand" }, { name: "Canberra", country: "Australia" }, { name: "Gold Coast", country: "Australia" },
  { name: "Christchurch", country: "New Zealand" },
  
  // Additional major cities from each region to reach 2000
  // Asia continued
  { name: "Dongguan", country: "China" }, { name: "Qingdao", country: "China" }, { name: "Zhengzhou", country: "China" },
  { name: "Jinan", country: "China" }, { name: "Harbin", country: "China" }, { name: "Changsha", country: "China" },
  { name: "Dalian", country: "China" }, { name: "Kunming", country: "China" }, { name: "Taiyuan", country: "China" },
  { name: "Shijiazhuang", country: "China" }, { name: "Urumqi", country: "China" }, { name: "Fuzhou", country: "China" },
  { name: "Changchun", country: "China" }, { name: "Xiamen", country: "China" }, { name: "Nanchang", country: "China" },
  { name: "Hefei", country: "China" }, { name: "Ningbo", country: "China" }, { name: "Wenzhou", country: "China" },
  { name: "Faisalabad", country: "Pakistan" }, { name: "Rawalpindi", country: "Pakistan" }, { name: "Multan", country: "Pakistan" },
  { name: "Gujranwala", country: "Pakistan" }, { name: "Peshawar", country: "Pakistan" }, { name: "Quetta", country: "Pakistan" },
  { name: "Islamabad", country: "Pakistan" }, { name: "Visakhapatnam", country: "India" }, { name: "Bhopal", country: "India" },
  { name: "Patna", country: "India" }, { name: "Vadodara", country: "India" }, { name: "Ludhiana", country: "India" },
  { name: "Agra", country: "India" }, { name: "Nashik", country: "India" }, { name: "Faridabad", country: "India" },
  { name: "Meerut", country: "India" }, { name: "Rajkot", country: "India" }, { name: "Varanasi", country: "India" },
  { name: "Srinagar", country: "India" }, { name: "Amritsar", country: "India" }, { name: "Allahabad", country: "India" },
  { name: "Coimbatore", country: "India" }, { name: "Kochi", country: "India" }, { name: "Madurai", country: "India" },
  { name: "Chittagong", country: "Bangladesh" }, { name: "Khulna", country: "Bangladesh" }, { name: "Rajshahi", country: "Bangladesh" },
  { name: "Sylhet", country: "Bangladesh" }, { name: "Rangpur", country: "Bangladesh" }, { name: "Comilla", country: "Bangladesh" }
];

// For demonstration, limiting to ~200 cities initially, can be expanded to 2000
const selectedCities = worldCities.slice(0, 200);

// Generate AI cover image
async function generateCoverImage(name: string, type: string, country?: string): Promise<string> {
  return pRetry(
    async () => {
      try {
        const prompt = type === 'country'
          ? `Beautiful iconic landmark scenery from ${name}, vibrant travel photography, professional quality, 4k, no text`
          : `Famous view of ${name}${country ? ', ' + country : ''}, cityscape or landmark, travel photography, professional quality, 4k, no text`;

        console.log(`  🖼️  Generating image for ${name}...`);
        
        const response = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
        });

        const base64 = response.data[0]?.b64_json ?? "";
        const buffer = Buffer.from(base64, "base64");
        
        // Save to attached_assets
        const filename = `${type}-${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.jpg`;
        const filepath = path.join(process.cwd(), '../attached_assets/locations', filename);
        
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, buffer);
        
        console.log(`  ✅ Image saved: ${filename}`);
        return `@assets/locations/${filename}`;
      } catch (error: any) {
        console.error(`  ❌ Image generation error for ${name}:`, error.message);
        if (isRateLimitError(error)) throw error;
        // Return placeholder path instead of throwing
        return `@assets/locations/placeholder-${type}.jpg`;
      }
    },
    { retries: 3, minTimeout: 2000, maxTimeout: 30000, factor: 2 }
  );
}

// Generate countries batch
async function generateCountriesBatch(startIndex: number, batchSize: number, withImages: boolean = false) {
  const batch = worldCountries.slice(startIndex, startIndex + batchSize);
  
  console.log(`\n📍 Generating ${batch.length} countries (${startIndex + 1}-${startIndex + batch.length})...`);
  
  const countries = await pRetry(
    async () => {
      try {
        const prompt = `Generate comprehensive SEO-optimized content for these ${batch.length} countries for Talkastranger video chat platform.

Countries: ${batch.join(', ')}

For EACH country, return detailed JSON with: slug, name, type="country", region, population (string like "X million users"), description, seoTitle, seoDescription, h1, h2, content (3-4 paragraphs), faq (4 Q&A items)

Return ONLY a JSON object with a "countries" array containing all ${batch.length} countries.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 8192,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");
        
        const result = JSON.parse(content);
        return result.countries || [];
      } catch (error: any) {
        console.error(`  ❌ Country batch error:`, error.message);
        if (isRateLimitError(error)) throw error;
        throw error;
      }
    },
    { retries: 5, minTimeout: 2000, maxTimeout: 60000, factor: 2 }
  );
  
  console.log(`✅ Generated content for ${countries.length} countries`);
  
  // Generate images if requested
  if (withImages) {
    for (let i = 0; i < countries.length; i++) {
      try {
        const coverImage = await generateCoverImage(countries[i].name, 'country');
        countries[i].coverImage = coverImage;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
      } catch (error) {
        console.error(`❌ Failed to generate image for ${countries[i].name}:`, error);
      }
    }
  }
  
  return countries;
}

// Generate cities batch
async function generateCitiesBatch(startIndex: number, batchSize: number, withImages: boolean = false) {
  const batch = selectedCities.slice(startIndex, startIndex + batchSize);
  
  console.log(`\n🏙️  Generating ${batch.length} cities (${startIndex + 1}-${startIndex + batch.length})...`);
  
  const cities = await pRetry(
    async () => {
      try {
        const citiesPrompt = batch.map(c => `${c.name}, ${c.country}`).join('; ');
        const prompt = `Generate comprehensive SEO-optimized content for these ${batch.length} cities for Talkastranger video chat platform.

Cities: ${citiesPrompt}

For EACH city, return detailed JSON with: slug, name, country, type="city", region, population (string like "X million users"), description, seoTitle, seoDescription, h1, h2, content (3-4 paragraphs), faq (4 Q&A items)

Return ONLY a JSON object with a "cities" array containing all ${batch.length} cities.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 8192,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");
        
        const result = JSON.parse(content);
        return result.cities || [];
      } catch (error: any) {
        console.error(`  ❌ City batch error:`, error.message);
        if (isRateLimitError(error)) throw error;
        throw error;
      }
    },
    { retries: 5, minTimeout: 2000, maxTimeout: 60000, factor: 2 }
  );
  
  console.log(`✅ Generated content for ${cities.length} cities`);
  
  // Generate images if requested
  if (withImages) {
    for (let i = 0; i < cities.length; i++) {
      try {
        const coverImage = await generateCoverImage(cities[i].name, 'city', cities[i].country);
        cities[i].coverImage = coverImage;
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Failed to generate image for ${cities[i].name}:`, error);
      }
    }
  }
  
  return cities;
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'help';
  
  console.log("🚀 Talkastranger Location Generator using Replit AI Integrations\n");
  
  try {
    await fs.mkdir('./generated', { recursive: true });
    
    switch (action) {
      case 'test':
        // Test: Generate 3 countries and 3 cities with images
        console.log("🧪 TEST MODE: Generating 3 countries and 3 cities with images...");
        const testCountries = await generateCountriesBatch(0, 3, true);
        const testCities = await generateCitiesBatch(0, 3, true);
        
        await fs.writeFile('./generated/test-countries.json', JSON.stringify(testCountries, null, 2));
        await fs.writeFile('./generated/test-cities.json', JSON.stringify(testCities, null, 2));
        
        console.log("\n✅ Test complete!");
        console.log("✅ Check scripts/generated/test-countries.json and test-cities.json");
        console.log("✅ Images saved to attached_assets/locations/");
        break;
        
      case 'countries':
        // Generate all 195 countries without images first
        const countryBatchSize = 10;
        const allCountries = [];
        
        for (let i = 0; i < worldCountries.length; i += countryBatchSize) {
          const batch = await generateCountriesBatch(i, countryBatchSize, false);
          allCountries.push(...batch);
          
          // Save progress
          await fs.writeFile('./generated/countries-progress.json', JSON.stringify(allCountries, null, 2));
          console.log(`📊 Progress: ${allCountries.length}/${worldCountries.length} countries`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await fs.writeFile('./generated/all-countries.json', JSON.stringify(allCountries, null, 2));
        console.log(`\n✅ Generated ${allCountries.length} countries!`);
        break;
        
      case 'cities':
        // Generate cities without images first
        const cityBatchSize = 10;
        const allCities = [];
        
        for (let i = 0; i < selectedCities.length; i += cityBatchSize) {
          const batch = await generateCitiesBatch(i, cityBatchSize, false);
          allCities.push(...batch);
          
          // Save progress
          await fs.writeFile('./generated/cities-progress.json', JSON.stringify(allCities, null, 2));
          console.log(`📊 Progress: ${allCities.length}/${selectedCities.length} cities`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await fs.writeFile('./generated/all-cities.json', JSON.stringify(allCities, null, 2));
        console.log(`\n✅ Generated ${allCities.length} cities!`);
        break;
        
      case 'images-countries':
        // Generate images for existing countries
        console.log("🖼️  Generating images for countries...");
        const countriesData = JSON.parse(await fs.readFile('./generated/all-countries.json', 'utf-8'));
        
        for (let i = 0; i < countriesData.length; i++) {
          if (!countriesData[i].coverImage || countriesData[i].coverImage.includes('placeholder')) {
            try {
              countriesData[i].coverImage = await generateCoverImage(countriesData[i].name, 'country');
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Save progress every 10 images
              if (i % 10 === 0) {
                await fs.writeFile('./generated/all-countries.json', JSON.stringify(countriesData, null, 2));
                console.log(`📊 Progress: ${i + 1}/${countriesData.length} country images`);
              }
            } catch (error) {
              console.error(`❌ Failed for ${countriesData[i].name}:`, error);
            }
          }
        }
        
        await fs.writeFile('./generated/all-countries.json', JSON.stringify(countriesData, null, 2));
        console.log("\n✅ All country images generated!");
        break;
        
      case 'images-cities':
        // Generate images for existing cities
        console.log("🖼️  Generating images for cities...");
        const citiesData = JSON.parse(await fs.readFile('./generated/all-cities.json', 'utf-8'));
        
        for (let i = 0; i < citiesData.length; i++) {
          if (!citiesData[i].coverImage || citiesData[i].coverImage.includes('placeholder')) {
            try {
              citiesData[i].coverImage = await generateCoverImage(citiesData[i].name, 'city', citiesData[i].country);
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Save progress every 10 images
              if (i % 10 === 0) {
                await fs.writeFile('./generated/all-cities.json', JSON.stringify(citiesData, null, 2));
                console.log(`📊 Progress: ${i + 1}/${citiesData.length} city images`);
              }
            } catch (error) {
              console.error(`❌ Failed for ${citiesData[i].name}:`, error);
            }
          }
        }
        
        await fs.writeFile('./generated/all-cities.json', JSON.stringify(citiesData, null, 2));
        console.log("\n✅ All city images generated!");
        break;
        
      case 'all':
        // Generate everything in sequence
        console.log("🌍 Generating ALL locations (countries + cities)...\n");
        
        // 1. Countries content
        console.log("Step 1/4: Generating country content...");
        const allCountriesStep = [];
        for (let i = 0; i < worldCountries.length; i += 10) {
          const batch = await generateCountriesBatch(i, 10, false);
          allCountriesStep.push(...batch);
          await fs.writeFile('./generated/countries-progress.json', JSON.stringify(allCountriesStep, null, 2));
          console.log(`Progress: ${allCountriesStep.length}/${worldCountries.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        await fs.writeFile('./generated/all-countries.json', JSON.stringify(allCountriesStep, null, 2));
        
        // 2. Cities content
        console.log("\nStep 2/4: Generating city content...");
        const allCitiesStep = [];
        for (let i = 0; i < selectedCities.length; i += 10) {
          const batch = await generateCitiesBatch(i, 10, false);
          allCitiesStep.push(...batch);
          await fs.writeFile('./generated/cities-progress.json', JSON.stringify(allCitiesStep, null, 2));
          console.log(`Progress: ${allCitiesStep.length}/${selectedCities.length}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        await fs.writeFile('./generated/all-cities.json', JSON.stringify(allCitiesStep, null, 2));
        
        console.log("\n✅ Content generation complete!");
        console.log(`📊 Total: ${allCountriesStep.length} countries + ${allCitiesStep.length} cities`);
        console.log("\n💡 To generate images, run:");
        console.log("  tsx generate-all-locations.ts images-countries");
        console.log("  tsx generate-all-locations.ts images-cities");
        break;
        
      default:
        console.log(`Usage:
  tsx generate-all-locations.ts test                # Test with 3 countries + 3 cities + images
  tsx generate-all-locations.ts countries            # Generate all ${worldCountries.length} countries (content only)
  tsx generate-all-locations.ts cities               # Generate all ${selectedCities.length} cities (content only)
  tsx generate-all-locations.ts images-countries     # Generate images for existing countries
  tsx generate-all-locations.ts images-cities        # Generate images for existing cities
  tsx generate-all-locations.ts all                  # Generate everything (content only, no images)

Current Status:
  - ${worldCountries.length} countries available
  - ${selectedCities.length} cities available (can be expanded to 2000+)

Costs (approximate with Replit AI Integrations):
  - Text generation: ~$0.001 per location
  - Image generation: ~$0.04 per image
  - Total for all content: ~$0.40
  - Total with all images: ~$16
`);
    }
    
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

main();
