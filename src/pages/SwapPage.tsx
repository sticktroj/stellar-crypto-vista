
import { useState, useEffect } from "react";
import { useWallet, CryptoAsset } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CryptoIcon } from "@/components/CryptoIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ArrowDownUp, RefreshCw } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function SwapPage() {
  const { assets } = useWallet();
  
  const [fromAsset, setFromAsset] = useState(assets[0]?.symbol || "");
  const [toAsset, setToAsset] = useState(assets[1]?.symbol || "");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapRate, setSwapRate] = useState(0);
  
  const fromAssetData = assets.find(asset => asset.symbol === fromAsset);
  const toAssetData = assets.find(asset => asset.symbol === toAsset);
  
  useEffect(() => {
    if (fromAssetData && toAssetData) {
      // Calculate swap rate
      const rate = toAssetData.price / fromAssetData.price;
      setSwapRate(rate);
      
      // Update to amount based on from amount
      if (fromAmount && !isNaN(parseFloat(fromAmount))) {
        setToAmount((parseFloat(fromAmount) * rate).toFixed(8));
      }
    }
  }, [fromAsset, toAsset, fromAmount, fromAssetData, toAssetData]);
  
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(parseFloat(value)) && swapRate) {
      setToAmount((parseFloat(value) * swapRate).toFixed(8));
    } else {
      setToAmount("");
    }
  };
  
  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (value && !isNaN(parseFloat(value)) && swapRate) {
      setFromAmount((parseFloat(value) / swapRate).toFixed(8));
    } else {
      setFromAmount("");
    }
  };
  
  const handleMaxAmount = () => {
    if (fromAssetData) {
      handleFromAmountChange(fromAssetData.balance.toString());
    }
  };
  
  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };
  
  const handleSwap = () => {
    if (!fromAsset || !toAsset || !fromAmount || !toAmount) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Simulate a successful swap
    toast.success(`Swapped ${fromAmount} ${fromAsset} to ${toAmount} ${toAsset}`);
    
    // Reset form
    setFromAmount("");
    setToAmount("");
  };
  
  return (
    <div className="container mx-auto max-w-md">
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Swap Crypto</h1>
      </div>
      
      <div className="space-y-6">
        {/* From Asset */}
        <div className="crypto-card p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">From</span>
            {fromAssetData && (
              <span className="text-sm text-muted-foreground">
                Available: {formatNumber(fromAssetData.balance)}
              </span>
            )}
          </div>
          
          <div className="flex gap-3 mb-2">
            <Select 
              value={fromAsset}
              onValueChange={setFromAsset}
            >
              <SelectTrigger className="w-1/3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.filter(asset => asset.symbol !== toAsset).map(asset => (
                  <SelectItem key={`from-${asset.id}`} value={asset.symbol}>
                    <div className="flex items-center gap-2">
                      <CryptoIcon symbol={asset.symbol} size={16} />
                      <span>{asset.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleMaxAmount}>
                Max
              </Button>
            </div>
          </div>
          
          {fromAssetData && fromAmount && !isNaN(parseFloat(fromAmount)) && (
            <p className="text-sm text-muted-foreground">
              ≈ {formatCurrency(parseFloat(fromAmount) * fromAssetData.price)}
            </p>
          )}
        </div>
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-muted" 
            onClick={handleSwapAssets}
          >
            <ArrowDownUp className="h-5 w-5" />
          </Button>
        </div>
        
        {/* To Asset */}
        <div className="crypto-card p-4">
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">To</span>
          </div>
          
          <div className="flex gap-3 mb-2">
            <Select 
              value={toAsset}
              onValueChange={setToAsset}
            >
              <SelectTrigger className="w-1/3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.filter(asset => asset.symbol !== fromAsset).map(asset => (
                  <SelectItem key={`to-${asset.id}`} value={asset.symbol}>
                    <div className="flex items-center gap-2">
                      <CryptoIcon symbol={asset.symbol} size={16} />
                      <span>{asset.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="0.00"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
            />
          </div>
          
          {toAssetData && toAmount && !isNaN(parseFloat(toAmount)) && (
            <p className="text-sm text-muted-foreground">
              ≈ {formatCurrency(parseFloat(toAmount) * toAssetData.price)}
            </p>
          )}
        </div>
        
        {fromAssetData && toAssetData && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Rate: 1 {fromAsset} = {formatNumber(swapRate)} {toAsset}</p>
          </div>
        )}
        
        <Button 
          className="w-full btn-gradient" 
          disabled={!fromAsset || !toAsset || !fromAmount || !toAmount}
          onClick={handleSwap}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Swap Now
        </Button>
      </div>
    </div>
  );
}

export default SwapPage;
