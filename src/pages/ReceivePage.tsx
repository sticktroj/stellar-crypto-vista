
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/components/CryptoIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Copy, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Mock wallet addresses for each asset
const mockAddresses: Record<string, string> = {
  BTC: "bc1q9h0nnxm5e36jgh79xnzse3xvzywlz9j5qj5ts5",
  ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  BNB: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
  SOL: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
  XRP: "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
  ADA: "addr1qxck4hyalr5p4khxj5fpg7x9svdevgzh7spne5rn82unvkry3eluqmhl0xmp9xn6kqgkkfzexjmdlpxw9g8v6j9gv0lskrvc63",
  DOGE: "DFundmtrigzA6E25Swr2pRe4Eb79bGP8G1",
  AVAX: "X-avax1cztdpkjvcvr24a30d3m4t8awnvj9hkz55ptp8e",
  MATIC: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  DOT: "14Fkxzn9R3nFrS5z8BFsNxiNsY6FEhwPqxvnRVYaJx1cAWBQ",
};

export function ReceivePage() {
  const { assets } = useWallet();
  const [selectedAsset, setSelectedAsset] = useState(assets[0]?.symbol || "");
  const [walletAddress, setWalletAddress] = useState("");
  
  useEffect(() => {
    if (selectedAsset) {
      // Set the mock address for the selected asset
      setWalletAddress(mockAddresses[selectedAsset] || "");
    }
  }, [selectedAsset]);
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard");
  };
  
  return (
    <div className="container mx-auto max-w-md">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Receive Crypto</h1>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Asset</label>
          <Select 
            defaultValue={selectedAsset}
            onValueChange={setSelectedAsset}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map(asset => (
                <SelectItem key={asset.id} value={asset.symbol}>
                  <div className="flex items-center gap-2">
                    <CryptoIcon symbol={asset.symbol} size={16} />
                    <span>{asset.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="crypto-card p-8 flex flex-col items-center justify-center">
          <div className="mb-4">
            <CryptoIcon symbol={selectedAsset} size={40} className="w-16 h-16" />
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-4">
            <QrCode size={180} />
          </div>
          
          <p className="text-sm font-medium mb-2">Your {selectedAsset} Address</p>
          <div className="bg-muted p-3 rounded-md w-full mb-4 break-all text-sm">
            {walletAddress}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleCopyAddress}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReceivePage;
