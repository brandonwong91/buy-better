"use client";

import { currencyMapping } from "../utils/currencyMapping";

interface Product {
  title: string;
  price: string;
  link: string;
  store: string;
  image?: string;
}

interface ProcessedProduct extends Product {
  numericPrice: number;
}

interface SearchResultsProps {
  homeCountry: string;
  visitingCountry: string;
  homeResults: Product[];
  visitingResults: Product[];
  isLoading: boolean;
  exchangeRate?: number | null;
}

function extractNumericPrice(priceStr: string): number {
  const numericValue = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(numericValue) || 0;
}

function findMatchingProduct(
  product: ProcessedProduct,
  productList: ProcessedProduct[]
): ProcessedProduct | null {
  return (
    productList.find((p) => {
      const titleSimilarity =
        p.title.toLowerCase().includes(product.title.toLowerCase()) ||
        product.title.toLowerCase().includes(p.title.toLowerCase());
      return titleSimilarity;
    }) || null
  );
}

export default function SearchResults({
  homeCountry,
  visitingCountry,
  homeResults,
  visitingResults,
  isLoading,
  exchangeRate,
}: SearchResultsProps) {
  // Process products to include numeric prices
  const processedHomeResults = homeResults.map((product) => ({
    ...product,
    numericPrice: extractNumericPrice(product.price),
  }));
  const processedVisitingResults = visitingResults.map((product) => ({
    ...product,
    numericPrice: extractNumericPrice(product.price),
  }));

  // Create matched pairs
  const matchedPairs: Array<{
    home: ProcessedProduct | null;
    visiting: ProcessedProduct | null;
  }> = [];
  const usedHomeIndices = new Set<number>();
  const usedVisitingIndices = new Set<number>();

  // First, find direct matches
  processedHomeResults.forEach((homeProduct, homeIndex) => {
    const matchingProduct = findMatchingProduct(
      homeProduct,
      processedVisitingResults
    );
    if (matchingProduct) {
      const visitingIndex = processedVisitingResults.indexOf(matchingProduct);
      if (!usedVisitingIndices.has(visitingIndex)) {
        matchedPairs.push({ home: homeProduct, visiting: matchingProduct });
        usedHomeIndices.add(homeIndex);
        usedVisitingIndices.add(visitingIndex);
      }
    }
  });

  // Add remaining unmatched products
  processedHomeResults.forEach((product, index) => {
    if (!usedHomeIndices.has(index)) {
      matchedPairs.push({ home: product, visiting: null });
    }
  });

  processedVisitingResults.forEach((product, index) => {
    if (!usedVisitingIndices.has(index)) {
      matchedPairs.push({ home: null, visiting: product });
    }
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center">
        <div className="animate-pulse">Loading results...</div>
      </div>
    );
  }

  if (!homeResults.length && !visitingResults.length) {
    return null;
  }

  // Check if there are any matched pairs where both home and visiting products exist
  const hasMatchedProducts = matchedPairs.some(
    (pair) => pair.home && pair.visiting
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Matched Products Table - Only show if there are matched products */}
      {hasMatchedProducts && (
        <div className="mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">
            Matched Products Comparison
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-background border-b">
                <th className="text-left p-4">Product Name</th>
                <th className="text-left p-4">{homeCountry}</th>
                <th className="text-left p-4">{visitingCountry}</th>
              </tr>
            </thead>
            <tbody>
              {matchedPairs
                .filter((pair) => pair.home && pair.visiting)
                .map((pair, index) => (
                  <tr key={index} className="border-b hover:bg-background/50">
                    <td className="p-4">{pair.home?.title}</td>
                    <td
                      className={`p-4 ${
                        pair.visiting &&
                        pair.home?.numericPrice &&
                        pair.visiting.numericPrice &&
                        exchangeRate &&
                        pair.home.numericPrice < (pair.visiting.numericPrice / exchangeRate)
                          ? "border-l-4 border-green-500"
                          : ""
                      }`}
                    >
                      {pair.home && (
                        <div>
                          <p className="font-bold">{pair.home.price}</p>
                          <p className="text-sm opacity-70">
                            {pair.home.store}
                          </p>
                          <a
                            href={pair.home.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline hover:opacity-80"
                          >
                            View Product
                          </a>
                        </div>
                      )}
                    </td>
                    <td
                      className={`p-4 ${
                        pair.home &&
                        pair.visiting?.numericPrice &&
                        pair.home.numericPrice &&
                        exchangeRate &&
                        (pair.visiting.numericPrice / exchangeRate) < pair.home.numericPrice
                          ? "border-l-4 border-green-500"
                          : ""
                      }`}
                    >
                      {pair.visiting && (
                        <div>
                          <p className="font-bold">
                            {pair.visiting.price}
                            {exchangeRate &&
                              pair.visiting.numericPrice &&
                              ` (${currencyMapping[homeCountry].symbol}${(
                                pair.visiting.numericPrice / exchangeRate
                              ).toFixed(2)})`}
                          </p>
                          <p className="text-sm opacity-70">
                            {pair.visiting.store}
                          </p>
                          <a
                            href={pair.visiting.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline hover:opacity-80"
                          >
                            View Product
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Products Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Home Country Results */}
        <div>
          <h2 className="text-xl font-bold mb-4">{homeCountry} Results</h2>
          <div className="space-y-4">
            {homeResults.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 bg-background">
                <div className="flex items-start gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-lg font-bold mt-2">{product.price}</p>
                    <p className="text-sm opacity-70">{product.store}</p>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm underline hover:opacity-80"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visiting Country Results */}
        <div>
          <h2 className="text-xl font-bold mb-4">{visitingCountry} Results</h2>
          <div className="space-y-4">
            {visitingResults.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 bg-background">
                <div className="flex items-start gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-lg font-bold mt-2">
                      {product.price}
                      {exchangeRate &&
                        ` (${currencyMapping[homeCountry].symbol}${(
                          extractNumericPrice(product.price) / exchangeRate
                        ).toFixed(2)})`}
                    </p>
                    <p className="text-sm opacity-70">{product.store}</p>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm underline hover:opacity-80"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
