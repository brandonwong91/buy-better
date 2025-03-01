'use client';

import { useState, useEffect } from 'react';
import { currencyMapping } from '../utils/currencyMapping';

interface SearchFormData {
  productName: string;
  homeCountry: string;
  visitingCountry: string;
  exchangeRate?: number | null;
}

const countries = [
  'Singapore',
  'Malaysia',
  'Indonesia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'United States',
  'United Kingdom',
  'European Union',
  'Japan',
  'Australia',
  'Canada'
];

interface SearchInterfaceProps {
  onSearch: (data: SearchFormData) => void;
}

export default function SearchInterface({ onSearch }: SearchInterfaceProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    productName: '',
    homeCountry: 'Singapore',
    visitingCountry: 'Malaysia'
  });
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoadingRate(true);
      try {
        const fromCurrency = currencyMapping[formData.homeCountry].code;
        const toCurrency = currencyMapping[formData.visitingCountry].code;
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(null);
      } finally {
        setIsLoadingRate(false);
      }
    };

    if (formData.homeCountry && formData.visitingCountry) {
      fetchExchangeRate();
    }
  }, [formData.homeCountry, formData.visitingCountry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      ...formData,
      exchangeRate
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full p-2 border rounded-md bg-background text-foreground"
            placeholder="e.g. Samsung Galaxy Watch 7"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="homeCountry" className="block text-sm font-medium mb-2">
              Home Country
            </label>
            <select
              id="homeCountry"
              value={formData.homeCountry}
              onChange={(e) => setFormData({ ...formData, homeCountry: e.target.value })}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              required
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country} ({currencyMapping[country].symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="visitingCountry" className="block text-sm font-medium mb-2">
              Visiting Country
            </label>
            <select
              id="visitingCountry"
              value={formData.visitingCountry}
              onChange={(e) => setFormData({ ...formData, visitingCountry: e.target.value })}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              required
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country} ({currencyMapping[country].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center text-sm">
          {isLoadingRate ? (
            <span>Loading exchange rate...</span>
          ) : exchangeRate ? (
            <span>
              1 {currencyMapping[formData.homeCountry].symbol} = {exchangeRate.toFixed(4)} {currencyMapping[formData.visitingCountry].symbol}
            </span>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full bg-foreground text-background py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
        >
          Compare Prices
        </button>
      </form>
    </div>
  );
}