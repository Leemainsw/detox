"use client";

import { Bar, BarChart, XAxis, Cell, LabelList } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface Props {
  userName?: string;
  userAmount?: number;
  compareName?: string;
  compareAmount?: number;
  data?: { month: string; my_spend: number; avg_spend: number }[];
  diffAmount?: number;
}

export default function ComparisonChart({
  userName,
  userAmount,
  compareName,
  compareAmount,
  data,
  diffAmount,
}: Props) {
  const chartData = data
    ? data.map((item) => ({
        name: item.month,
        amount: item.my_spend,
        avg: item.avg_spend,
      }))
    : [
        { name: userName || "나", amount: userAmount || 0 },
        { name: compareName || "평균", amount: compareAmount || 0 },
      ];

  const chartConfig = {
    amount: { label: "소비 금액" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-6 py-6 bg-gray-50 rounded-3xl h-56">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "black", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={30}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === chartData.length - 1 ||
                    (chartData.length === 2 && index === 0)
                      ? "#2DD4BF"
                      : "#D1D5DB"
                  }
                />
              ))}
              <LabelList
                dataKey="amount"
                position="top"
                formatter={(val: number) => `${(val / 10000).toFixed(1)}만`}
                style={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {diffAmount !== undefined && diffAmount > 0 && (
        <div className="mx-6 px-4 py-3 bg-teal-50 border border-teal-100 rounded-xl">
          <p className="text-sm text-teal-800 font-medium">
            💡 지금보다{" "}
            <span className="font-bold">{diffAmount.toLocaleString()}원</span>을
            더 아낄 수 있어요!
          </p>
        </div>
      )}
    </div>
  );
}
