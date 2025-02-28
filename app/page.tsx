'use client';

import { useState } from 'react';
import SearchInterface from './components/SearchInterface';
import SearchResults from './components/SearchResults';

interface Product {
  title: string;
  price: string;
  link: string;
  store: string;
  image?: string;
}

interface SearchFormData {
  productName: string;
  homeCountry: string;
  visitingCountry: string;
  exchangeRate?: number | null;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState({
    homeResults: [] as Product[],
    visitingResults: [] as Product[],
    homeCountry: '',
    visitingCountry: '',
    isLoading: false,
    exchangeRate: undefined as number | null | undefined
  });

  const handleSearch = async (formData: SearchFormData) => {
    setSearchResults(prev => ({
      ...prev,
      isLoading: true,
      homeCountry: formData.homeCountry,
      visitingCountry: formData.visitingCountry,
      exchangeRate: formData.exchangeRate
    }));

    try {
      const fetchProducts = async (country: string, query: string) => {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country,
            query,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      };

      const [homeData, visitingData] = await Promise.all([
        fetchProducts(formData.homeCountry, formData.productName),
        fetchProducts(formData.visitingCountry, formData.productName),
      ]);

      const results = {
        homeResults: homeData.products,
        visitingResults: visitingData.products,
      };

      setSearchResults(prev => ({
        ...prev,
        isLoading: false,
        homeResults: results.homeResults,
        visitingResults: results.visitingResults
      }));
    } catch (error) {
      console.error('Error fetching results:', error);
      setSearchResults(prev => ({
        ...prev,
        isLoading: false,
        homeResults: [],
        visitingResults: []
      }));
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Buy Better - Cross-Country Price Comparison</h1>
      <SearchInterface onSearch={handleSearch} />
      <SearchResults {...searchResults} />
    </div>
  );
}
