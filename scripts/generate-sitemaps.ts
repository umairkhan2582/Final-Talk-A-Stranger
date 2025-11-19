import { COUNTRIES, CITIES } from '../shared/locations';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://talkastranger.com';
const OUTPUT_DIR = path.join(process.cwd(), 'public');
const today = new Date().toISOString().split('T')[0];

// Generate sitemap-main.xml (static pages)
function generateMainSitemap(): string {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/countries', changefreq: 'weekly', priority: '0.9' },
    { loc: '/cities', changefreq: 'weekly', priority: '0.9' },
    { loc: '/areas', changefreq: 'weekly', priority: '0.9' },
    { loc: '/sitemap', changefreq: 'monthly', priority: '0.5' },
    { loc: '/about', changefreq: 'monthly', priority: '0.5' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
    { loc: '/terms', changefreq: 'monthly', priority: '0.3' },
    { loc: '/privacy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/community-guidelines', changefreq: 'monthly', priority: '0.3' },
  ];

  const urlset = urls.map(({ loc, changefreq, priority }) => `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

// Generate sitemap-countries.xml (all countries)
function generateCountriesSitemap(): string {
  const urlset = COUNTRIES.map(country => `  <url>
    <loc>${BASE_URL}/location/country/${country.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

// Generate sitemap-cities.xml (all cities)
function generateCitiesSitemap(): string {
  const urlset = CITIES.map(city => `  <url>
    <loc>${BASE_URL}/location/city/${city.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

// Generate sitemap index (sitemap.xml)
function generateSitemapIndex(): string {
  const sitemaps = [
    'sitemap-main.xml',
    'sitemap-countries.xml',
    'sitemap-cities.xml',
  ];

  const sitemapEntries = sitemaps.map(filename => `  <sitemap>
    <loc>${BASE_URL}/${filename}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>
`;
}

// Main execution
async function main() {
  console.log('Generating sitemaps...');
  console.log(`- Countries: ${COUNTRIES.length}`);
  console.log(`- Cities: ${CITIES.length}`);
  console.log(`- Total URLs: ${10 + COUNTRIES.length + CITIES.length}\n`);

  // Generate all sitemaps
  const mainSitemap = generateMainSitemap();
  const countriesSitemap = generateCountriesSitemap();
  const citiesSitemap = generateCitiesSitemap();
  const sitemapIndex = generateSitemapIndex();

  // Write files
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-main.xml'), mainSitemap);
  console.log('✓ Generated sitemap-main.xml (10 URLs)');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-countries.xml'), countriesSitemap);
  console.log(`✓ Generated sitemap-countries.xml (${COUNTRIES.length} URLs)`);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-cities.xml'), citiesSitemap);
  console.log(`✓ Generated sitemap-cities.xml (${CITIES.length} URLs)`);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapIndex);
  console.log('✓ Generated sitemap.xml (index file)\n');

  console.log('✅ Sitemap generation complete!');
  console.log(`\nSitemaps available at:`);
  console.log(`- ${BASE_URL}/sitemap.xml (index)`);
  console.log(`- ${BASE_URL}/sitemap-main.xml`);
  console.log(`- ${BASE_URL}/sitemap-countries.xml`);
  console.log(`- ${BASE_URL}/sitemap-cities.xml`);
}

main().catch(console.error);
