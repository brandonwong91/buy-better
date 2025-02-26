import { NextResponse } from "next/server";

interface SearchRequest {
  country: string;
  query: string;
}

interface Product {
  title: string;
  price: string;
  link: string;
  store: string;
  image?: string;
}

interface GeminiContent {
  parts: Array<{
    text: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: GeminiContent;
  }>;
}

async function searchProducts(
  country: string,
  query: string
): Promise<Product[]> {
  const prompt = `Search for ${query} prices in ${country}. For each product, provide:
  1. Product title
  2. Price (in local currency)
  3. Store name
  4. Store URL
  Format the response as a valid JSON array with exactly 5 results. Each result should be an object with these properties:
  - title: string (product name)
  - price: string (price with currency)
  - store: string (store name)
  - link: string (product URL)
  
  Important: Ensure the response is a valid JSON array that can be parsed. Do not include any explanatory text before or after the JSON array.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  try {
    console.log('Searching with Gemini API...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      console.error('Gemini API request failed:', response.status);
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('Gemini API response received');

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    let products: Product[];

    try {
      // Clean the response text to ensure it only contains the JSON array
      const cleanedText = responseText.trim().replace(/^[^\[]+/, '').replace(/[^\]]+$/, '');
      products = JSON.parse(cleanedText);
      
      if (!Array.isArray(products)) {
        throw new Error('Response is not an array');
      }
      
      // Validate each product has required fields
      products.forEach((product, index) => {
        if (!product || typeof product !== 'object') {
          throw new Error(`Product at index ${index} is not an object`);
        }
        if (!product.title || typeof product.title !== 'string') {
          throw new Error(`Invalid or missing title for product at index ${index}`);
        }
        if (!product.price || typeof product.price !== 'string') {
          throw new Error(`Invalid or missing price for product at index ${index}`);
        }
        if (!product.store || typeof product.store !== 'string') {
          throw new Error(`Invalid or missing store for product at index ${index}`);
        }
        if (!product.link || typeof product.link !== 'string') {
          throw new Error(`Invalid or missing link for product at index ${index}`);
        }
      });
    } catch (error) {
      console.error('Failed to parse or validate Gemini response:', error);
      throw new Error(`Failed to parse product data: ${error.message}`);
    }

    // Validate and clean up the products
    return products.map(product => ({
      title: product.title || 'Unknown Product',
      price: product.price || 'Price not available',
      store: product.store || 'Unknown Store',
      link: product.link || '#',
      image: '' // Gemini doesn't provide images
    }));

  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body: SearchRequest = await request.json();
    const { country, query } = body;

    if (!country || !query) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const products = await searchProducts(country, query);

    console.log('Returning products:', products.length);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
