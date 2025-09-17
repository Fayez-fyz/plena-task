import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppSelector } from "@/redux/hooks";

const colors = [
  "#10B981",
  "#A78BFA",
  "#60A5FA",
  "#18C9DD",
  "#FB923C",
  "#FB7185",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#4CAF50",
  "#2196F3",
  "#FFC107",
];

const Portfolio = () => {
  const tokens = useAppSelector((state) => state.watchlist.tokens);
  const lastUpdated = useAppSelector((state) => state.watchlist.lastUpdated);

  const relevantTokens = tokens.filter((t) => t.holdings > 0);
  const totalValue = relevantTokens.reduce(
    (sum, t) => sum + t.holdings * (t.price || 0),
    0
  );

  const tokenData = relevantTokens.map((t, index) => ({
    name: t.name,
    symbol: t.symbol.toUpperCase(),
    value: totalValue > 0 ? (t.holdings * (t.price || 0) / totalValue) * 100 : 0,
    color: colors[index % colors.length],
  }));

  const chartConfig = relevantTokens.reduce((acc, t, index) => {
    const key = t.name.toLowerCase().replace(/\s+/g, "");
    acc[key] = {
      label: t.name,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const hasData = tokenData.length > 0 && totalValue > 0;

  return (
    <div className="bg-foreground p-3 md:p-5 m-2 md:m-4 rounded-[12px]">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-0">
        <div className="flex flex-col justify-between flex-wrap h-fill-available lg:flex-1">
          <div className="flex flex-col gap-2 md:gap-4">
            <p className="text-muted text-sm md:text-base font-medium">
              Portfolio Total
            </p>
            <h2 className="text-secondary tracking-wide text-[40px] md:text-[56px] font-medium">
              ${totalValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          {!hasData ? (
            <p className="text-muted text-sm font-normal mt-2 lg:mt-0">
              No holdings yet
            </p>
          ) : (
            <p className="text-muted text-xs font-normal mt-2 lg:mt-0">
              Last updated: {lastUpdated || "N/A"}
            </p>
          )}
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-center lg:flex-1 gap-6">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-56 w-full gap-4">
              <p className="text-muted text-sm md:text-base font-medium">
                No portfolio data available
              </p>
              <p className="text-muted text-xs text-center">
                Add tokens to your watchlist and set holdings to see your portfolio breakdown
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 lg:gap-6 items-center lg:items-start">
                <p className="text-muted text-sm md:text-base self-start font-medium">
                  Portfolio Total
                </p>
                <div className="h-56 w-56">
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tokenData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          className="md:!inner-radius-[50] md:!outer-radius-[100] lg:!inner-radius-[60] lg:!outer-radius-[120]"
                        >
                          {tokenData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:flex-1">
                <div className="space-y-2 md:space-y-3">
                  {tokenData.map((token, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <span
                          className="font-medium text-xs md:text-sm"
                          style={{ color: token.color }}
                        >
                          {token.name} ({token.symbol})
                        </span>
                      </div>
                      <span className="text-muted font-medium text-xs md:text-sm">
                        {token.value.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;