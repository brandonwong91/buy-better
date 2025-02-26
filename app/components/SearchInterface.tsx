'use client';

import { useState } from 'react';

interface SearchFormData {
  productName: string;
  homeCountry: string;
  visitingCountry: string;
}

const countries = [
  'Singapore',
  'Malaysia',
  'Indonesia',
  'Thailand',
  'Vietnam',
  'Philippines'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
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
                  {country}
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
                  {country}
                </option>
              ))}
            </select>
          </div>
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