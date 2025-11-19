import { Location, COUNTRIES, CITIES, AREAS } from './locations';

// Priority countries to show first (international)
const priorityCountries = [
  'united-states', 'united-kingdom', 'canada', 'australia', 'germany', 'france',
  'japan', 'brazil', 'mexico', 'spain', 'italy', 'south-korea', 'netherlands',
  'switzerland', 'sweden', 'norway', 'denmark', 'belgium', 'austria', 'portugal'
];

// Get sorted locations with international ones first
export function getSortedCountries(): Location[] {
  const priority: Location[] = [];
  const others: Location[] = [];
  
  COUNTRIES.forEach(country => {
    if (priorityCountries.includes(country.slug)) {
      priority.push(country);
    } else {
      others.push(country);
    }
  });
  
  // Sort priority by the order in priorityCountries array
  priority.sort((a, b) => {
    const indexA = priorityCountries.indexOf(a.slug);
    const indexB = priorityCountries.indexOf(b.slug);
    return indexA - indexB;
  });
  
  return [...priority, ...others];
}

export function getSortedCities(): Location[] {
  const international: Location[] = [];
  const pakistanIndia: Location[] = [];
  
  CITIES.forEach(city => {
    if (city.country === 'Pakistan' || city.country === 'India') {
      pakistanIndia.push(city);
    } else {
      international.push(city);
    }
  });
  
  return [...international, ...pakistanIndia];
}

export function getSortedAreas(): Location[] {
  const international: Location[] = [];
  const pakistanIndia: Location[] = [];
  
  AREAS.forEach(area => {
    if (area.country === 'Pakistan' || area.country === 'India') {
      pakistanIndia.push(area);
    } else {
      international.push(area);
    }
  });
  
  return [...international, ...pakistanIndia];
}
