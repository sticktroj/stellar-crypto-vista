
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CryptoIcon } from "@/components/CryptoIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Send } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function SendPage() {
  const { assets } = useWallet();
  
  const [selectedAsset, setSelectedAsset] = useState(assets[0]?.symbol || "");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  
  const selectedAssetData = assets.find(asset => asset.symbol === selectedAsset);
  
  const handleMaxAmount = () => {
    if (selectedAssetData) {
      setAmount(selectedAssetData.balance.toString());
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset || !amount || !address) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Simulate a successful transaction
    toast.success(`${amount} ${selectedAsset} sent successfully`);
    
    // Reset form
    setAmount("");
    setAddress("");
  };
  
  return (
    <div className="container mx-auto max-w-md">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Send Crypto</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="asset">Select Asset</Label>
          <Select 
            defaultValue={selectedAsset}
            onValueChange={setSelectedAsset}
          >
            <SelectTrigger id="asset">
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map(asset => (
                <SelectItem key={asset.id} value={asset.symbol}>
                  <div className="flex items-center gap-2">
                    <CryptoIcon symbol={asset.symbol} size={16} />
                    <span>{asset.symbol}</span>
                    <span className="text-muted-foreground">
                      ({formatNumber(asset.balance)})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="amount">Amount</Label>
            {selectedAssetData && (
              <span className="text-sm text-muted-foreground">
                Available: {formatNumber(selectedAssetData.balance)} {selectedAssetData.symbol}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleMaxAmount}>
              Max
            </Button>
          </div>
          
          {selectedAssetData && amount && !isNaN(parseFloat(amount)) && (
            <p className="text-sm text-muted-foreground">
              ≈ {formatCurrency(parseFloat(amount) * selectedAssetData.price)}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Recipient Address</Label>
          <Input
            id="address"
            placeholder="Enter wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full btn-gradient" 
          disabled={!selectedAsset || !amount || !address}
        >
          <Send className="mr-2 h-4 w-4" />
          Send {selectedAsset}
        </Button>
      </form>
    </div>
  );
}

export default SendPage;
