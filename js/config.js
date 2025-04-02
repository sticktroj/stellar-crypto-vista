
// Configuration settings for the app
const CONFIG = {
  apiBaseUrl: 'https://min-api.cryptocompare.com/data',
  supportedAssets: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'USDT', 'TRX', 'TON'],
  refreshInterval: 60000, // 1 minute
  defaultFiat: 'USD',
  mockBalances: {
    BTC: 0.18915,
    ETH: 1.6956,
    BNB: 4.2345,
    SOL: 25.7652,
    XRP: 450.2341,
    ADA: 1023.5678,
    DOGE: 3520.1234,
    USDT: 500.75,
    TRX: 15000.432,
    TON: 75.5432
  },
  // Maps crypto symbols to their full names
  cryptoNames: {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    BNB: 'Binance Coin',
    SOL: 'Solana',
    XRP: 'XRP',
    ADA: 'Cardano',
    DOGE: 'Dogecoin',
    USDT: 'Tether',
    TRX: 'TRON',
    TON: 'TON'
  },
  // Maps symbols to icon classes (for FontAwesome or custom icons)
  cryptoIcons: {
    BTC: 'fa-brands fa-bitcoin',
    ETH: 'fa-solid fa-circle-dollar-sign',
    BNB: 'fa-solid fa-coins',
    SOL: 'fa-solid fa-coins',
    XRP: 'fa-solid fa-database',
    ADA: 'fa-solid fa-coins',
    DOGE: 'fa-solid fa-coins',
    USDT: 'fa-solid fa-dollar-sign',
    TRX: 'fa-solid fa-coins',
    TON: 'fa-solid fa-coins'
  },
  // Primary color for the application
  primaryColor: '#6C5DD3'
};

// Add a CSS variable for the primary color
document.documentElement.style.setProperty('--color-primary', CONFIG.primaryColor);
