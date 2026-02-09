"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface RevenueDistributionProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#adfa1d", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6"];

export function RevenueDistribution({ data }: RevenueDistributionProps) {
  // Calculate total for percentage
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data],
  );

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Revenue by Sport</CardTitle>
        <CardDescription>Earnings distribution across sports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#171717",
                  borderColor: "#262626",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.slice(0, 5).map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-neutral-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">
                  ₹{item.value.toLocaleString()}
                </span>
                <span className="text-neutral-500 w-12 text-right">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
