
import { 
  Bitcoin, 
  CircleDollarSign, 
  DollarSign, 
  Coins, 
  BarChart4, 
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function CryptoIcon({ symbol, size = 24, className }: CryptoIconProps) {
  const symbolLower = symbol.toLowerCase();
  
  let IconComponent;
  let iconColor;
  
  switch (symbolLower) {
    case 'btc':
      IconComponent = Bitcoin;
      iconColor = "text-wallet-btc";
      break;
    case 'eth':
      IconComponent = CircleDollarSign; // Replaced Ethereum with CircleDollarSign
      iconColor = "text-wallet-eth";
      break;
    case 'usdt':
      IconComponent = DollarSign;
      iconColor = "text-wallet-usdt";
      break;
    case 'eos':
      IconComponent = Coins;
      iconColor = "text-wallet-eos";
      break;
    case 'bnb':
      IconComponent = Coins;
      iconColor = "text-yellow-500";
      break;
    case 'sol':
      IconComponent = Coins;
      iconColor = "text-purple-500";
      break;
    case 'xrp':
      IconComponent = Database;
      iconColor = "text-blue-400";
      break;
    case 'ada':
      IconComponent = Coins;
      iconColor = "text-blue-500";
      break;
    case 'doge':
      IconComponent = Coins;
      iconColor = "text-yellow-300";
      break;
    case 'avax':
      IconComponent = BarChart4;
      iconColor = "text-red-500";
      break;
    case 'matic':
      IconComponent = Coins;
      iconColor = "text-purple-600";
      break;
    case 'dot':
      IconComponent = Coins;
      iconColor = "text-pink-500";
      break;
    default:
      IconComponent = Coins;
      iconColor = "text-gray-500";
  }

  return (
    <div className={cn(`crypto-icon crypto-icon-${symbolLower}`, className)}>
      <IconComponent size={size} className={iconColor} />
    </div>
  );
}
