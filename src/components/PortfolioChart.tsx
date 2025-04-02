
import { useWallet } from "@/context/WalletContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";

export function PortfolioChart() {
  const { assets, totalBalance } = useWallet();
  
  // Generate colors for pie chart
  const COLORS = ['#6C5DD3', '#F7931A', '#627EEA', '#3C5DFD', '#26A17B', '#2775CA', '#E84142', '#E84142', '#8247E5', '#E6007A'];
  
  // Transform data for the pie chart
  const chartData = assets.map((asset, index) => ({
    name: asset.symbol,
    value: asset.value,
    color: COLORS[index % COLORS.length]
  }));
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="font-bold">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">
            {((data.value / totalBalance) * 100).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="chart-container mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-sm text-muted-foreground">PORTFOLIO VALUE</h2>
        <p className="font-bold text-2xl">{formatCurrency(totalBalance)}</p>
      </div>
    </div>
  );
}
