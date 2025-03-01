interface CurrencyMapping {
  [country: string]: {
    code: string;
    symbol: string;
  };
}

export const currencyMapping: CurrencyMapping = {
  Singapore: {
    code: 'SGD',
    symbol: 'S$'
  },
  Malaysia: {
    code: 'MYR',
    symbol: 'RM'
  },
  Indonesia: {
    code: 'IDR',
    symbol: 'Rp'
  },
  Thailand: {
    code: 'THB',
    symbol: '฿'
  },
  Vietnam: {
    code: 'VND',
    symbol: '₫'
  },
  Philippines: {
    code: 'PHP',
    symbol: '₱'
  },
  'United States': {
    code: 'USD',
    symbol: '$'
  },
  'United Kingdom': {
    code: 'GBP',
    symbol: '£'
  },
  'European Union': {
    code: 'EUR',
    symbol: '€'
  },
  Japan: {
    code: 'JPY',
    symbol: '¥'
  },
  Australia: {
    code: 'AUD',
    symbol: 'A$'
  },
  Canada: {
    code: 'CAD',
    symbol: 'C$'
  }
};