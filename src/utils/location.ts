import { Country, City, ICountry, ICity } from 'country-state-city';

export type { ICountry, ICity };

export function getAllCountries(): ICountry[] {
  return Country.getAllCountries();
}

export function getCountryByCode(code: string): ICountry | undefined {
  return Country.getCountryByCode(code);
}

export function getCitiesOfCountry(countryCode: string): ICity[] {
  return City.getCitiesOfCountry(countryCode) ?? [];
}

export function filterCities(cities: ICity[], query: string): ICity[] {
  if (!query.trim()) return cities.slice(0, 20);

  const lowerQuery = query.toLowerCase();
  return cities
    .filter(city => city.name.toLowerCase().includes(lowerQuery))
    .slice(0, 20);
}

export function findCityByName(cities: ICity[], name: string): ICity | undefined {
  const lowerName = name.toLowerCase();
  return cities.find(city => city.name.toLowerCase() === lowerName);
}
