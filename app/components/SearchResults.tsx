'use client';

interface Product {
  title: string;
  price: string;
  link: string;
  store: string;
  image?: string;
}

interface SearchResultsProps {
  homeCountry: string;
  visitingCountry: string;
  homeResults: Product[];
  visitingResults: Product[];
  isLoading: boolean;
}

export default function SearchResults({
  homeCountry,
  visitingCountry,
  homeResults,
  visitingResults,
  isLoading
}: SearchResultsProps) {
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
}