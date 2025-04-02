
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  iconClass: string;
  price: number;
  priceChange24h: number;
  balance: number;
  value: number;
}

interface WalletContextType {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
  totalBalance: number;
  refreshData: () => Promise<void>;
  selectedAsset: CryptoAsset | null;
  setSelectedAsset: (asset: CryptoAsset | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  // Mock balances - in a real app this would come from a wallet API
  const mockBalances = {
    BTC: 0.18915,
    ETH: 1.6956,
    BNB: 4.2345,
    SOL: 25.7652,
    XRP: 450.2341,
    ADA: 1023.5678,
    DOGE: 3520.1234,
    AVAX: 51.2345,
    MATIC: 851.6789,
    DOT: 124.5678,
  };

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Top 10 crypto assets
      const symbols = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "AVAX", "MATIC", "DOT"];
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join(",")}&tsyms=USD`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch crypto data");
      
      const data = await response.json();
      
      const cryptoAssets: CryptoAsset[] = symbols.map(symbol => {
        const cryptoData = data.RAW[symbol].USD;
        const balance = mockBalances[symbol as keyof typeof mockBalances] || 0;
        const price = cryptoData.PRICE;
        
        return {
          id: symbol.toLowerCase(),
          name: getFullName(symbol),
          symbol,
          iconClass: `crypto-icon-${symbol.toLowerCase()}`,
          price,
          priceChange24h: cryptoData.CHANGEPCT24HOUR,
          balance,
          value: balance * price
        };
      });
      
      setAssets(cryptoAssets);
      
      // If no asset is selected, select the first one
      if (!selectedAsset && cryptoAssets.length > 0) {
        setSelectedAsset(cryptoAssets[0]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError("Failed to load cryptocurrency data. Please try again later.");
      setLoading(false);
      toast.error("Failed to load cryptocurrency data");
    }
  };

  // Helper function to get full names
  const getFullName = (symbol: string): string => {
    const names: Record<string, string> = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      BNB: "Binance Coin",
      SOL: "Solana",
      XRP: "XRP",
      ADA: "Cardano",
      DOGE: "Dogecoin",
      AVAX: "Avalanche",
      MATIC: "Polygon",
      DOT: "Polkadot",
    };
    return names[symbol] || symbol;
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchCryptoData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const totalBalance = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <WalletContext.Provider
      value={{
        assets,
        loading,
        error,
        totalBalance,
        refreshData: fetchCryptoData,
        selectedAsset,
        setSelectedAsset,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
