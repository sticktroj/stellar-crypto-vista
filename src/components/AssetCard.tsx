
import { CryptoAsset } from "@/context/WalletContext";
import { CryptoIcon } from "./CryptoIcon";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/formatters";

interface AssetCardProps {
  asset: CryptoAsset;
  onClick?: () => void;
  selected?: boolean;
}

export function AssetCard({ asset, onClick, selected = false }: AssetCardProps) {
  const { symbol, name, price, priceChange24h, balance, value } = asset;
  
  return (
    <div 
      onClick={onClick}
      className={`crypto-card p-4 cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CryptoIcon symbol={symbol} />
          <div>
            <h3 className="font-bold">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatNumber(balance)}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="font-medium">{formatCurrency(price)}</p>
        </div>
        <div className={`text-sm ${priceChange24h >= 0 ? "text-positive" : "text-negative"}`}>
          {formatPercentage(priceChange24h)}
        </div>
      </div>
    </div>
  );
}
