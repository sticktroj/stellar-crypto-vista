
import { useWallet } from "@/context/WalletContext";
import { AssetList } from "@/components/AssetList";
import { PortfolioChart } from "@/components/PortfolioChart";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Dashboard() {
  const { refreshData, loading } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success("Portfolio data updated");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="mb-8">
        <PortfolioChart />
      </div>
      
      <h2 className="text-xl font-bold mb-4">Your Assets</h2>
      <AssetList />
    </div>
  );
}

export default Dashboard;
