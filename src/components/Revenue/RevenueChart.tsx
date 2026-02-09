"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartDataPoint } from "@/hooks/useRevenueData";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartConfig = {
    booking: {
      label: "Bookings",
      color: "#adfa1d",
    },
    tournament: {
      label: "Tournaments",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
            <CardDescription>Breakdown of earnings over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-neutral-800">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#adfa1d] data-[state=active]:text-neutral-950"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="data-[state=active]:bg-[#adfa1d] data-[state=active]:text-neutral-950"
              >
                Bookings
              </TabsTrigger>
              <TabsTrigger
                value="tournaments"
                className="data-[state=active]:bg-[#adfa1d] data-[state=active]:text-neutral-950"
              >
                Tournaments
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] sm:min-w-full">
              <TabsContent value="overview">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[350px] w-full"
                >
                  <LineChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} stroke="#333" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value: string) => value}
                      stroke="#888"
                    />
                    <YAxis
                      stroke="#888"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: number) => `₹${value}`}
                      tickCount={8}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />

                    <Line
                      type="monotone"
                      dataKey="booking"
                      stroke="var(--color-booking)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="tournament"
                      stroke="var(--color-tournament)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="bookings">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[350px] w-full"
                >
                  <LineChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} stroke="#333" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value: string) => value}
                      stroke="#888"
                    />
                    <YAxis
                      stroke="#888"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: number) => `₹${value}`}
                      tickCount={8}
                    />
                    <Tooltip content={<ChartTooltipContent />} />

                    <Line
                      type="monotone"
                      dataKey="booking"
                      stroke="var(--color-booking)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="tournaments">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[350px] w-full"
                >
                  <LineChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} stroke="#333" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value: string) => value}
                      stroke="#888"
                    />
                    <YAxis
                      stroke="#888"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: number) => `₹${value}`}
                      tickCount={8}
                    />
                    <Tooltip content={<ChartTooltipContent />} />

                    <Line
                      type="monotone"
                      dataKey="tournament"
                      stroke="var(--color-tournament)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
