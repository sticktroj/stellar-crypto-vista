
// Format a number to a readable string with specified decimal places
export function formatNumber(value: number, decimals = 6): string {
  // For very small numbers, show more decimals
  if (Math.abs(value) < 0.001 && value !== 0) {
    return value.toFixed(8);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Format a number as currency (USD)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format a number as percentage
export function formatPercentage(value: number): string {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value / 100);
  
  return formattedValue;
}

// Create a short address for display
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
