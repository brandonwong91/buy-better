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
  }
};