# Buy Better - Cross-Country Price Comparison

Buy Better is a web application that helps users compare product prices across different countries. It leverages Google's Gemini AI to fetch and analyze product information, making it easier for travelers and online shoppers to make informed purchasing decisions.

## Features

- Compare product prices between your home country and a visiting country
- Real-time price information from various online stores
- Support for multiple countries and currencies
- Clean and intuitive user interface
- Automatic currency conversion
- Direct links to product search results

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for production
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Google Gemini API](https://ai.google.dev/) - AI-powered product search and analysis

## Prerequisites

- Node.js 18.x or later
- Yarn or npm package manager
- Google Gemini API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/buy-better.git
cd buy-better
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter the product name you want to compare
2. Select your home country
3. Select the visiting country
4. Click "Search" to see price comparisons
5. Review the results showing prices from both countries
6. Click on product links to view the items on their respective store websites

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
