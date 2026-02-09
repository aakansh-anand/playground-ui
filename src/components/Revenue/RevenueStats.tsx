import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryMetrics } from "@/hooks/useRevenueData";
import { Calendar, TrendingUp, Trophy } from "lucide-react";

interface RevenueStatsProps {
  summary: SummaryMetrics;
}

export const RevenueStats = ({ summary }: RevenueStatsProps) => {
  const avgValue =
    summary.totalBookings + summary.totalTournaments > 0
      ? summary.totalRevenue /
        (summary.totalBookings + summary.totalTournaments)
      : 0;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <Card className="bg-neutral-900 border-neutral-800 hover:border-[#adfa1d]/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Total Revenue
          </CardTitle>
          <div className="h-4 w-4 text-[#adfa1d] font-bold">₹</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ₹{summary.totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">Selected period revenue</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 hover:border-[#adfa1d]/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Total Bookings
          </CardTitle>
          <Calendar className="h-4 w-4 text-[#adfa1d]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {summary.totalBookings.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">Confirmed bookings</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 hover:border-[#adfa1d]/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Total Tournaments
          </CardTitle>
          <Trophy className="h-4 w-4 text-[#adfa1d]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {summary.totalTournaments}
          </div>
          <p className="text-xs text-neutral-500">Organized tournaments</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 hover:border-[#adfa1d]/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Avg. Transaction
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-[#adfa1d]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ₹{Math.round(avgValue).toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">Per booking/tournament</p>
        </CardContent>
      </Card>
    </div>
  );
};
