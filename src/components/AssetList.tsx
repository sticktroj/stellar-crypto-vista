
import { useWallet } from "@/context/WalletContext";
import { AssetCard } from "./AssetCard";
import { Skeleton } from "@/components/ui/skeleton";

export function AssetList() {
  const { assets, loading, setSelectedAsset, selectedAsset } = useWallet();
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="crypto-card p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <AssetCard 
          key={asset.id}
          asset={asset}
          onClick={() => setSelectedAsset(asset)}
          selected={selectedAsset?.id === asset.id}
        />
      ))}
    </div>
  );
}
