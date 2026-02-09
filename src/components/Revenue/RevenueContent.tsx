"use client";

import { useRevenueData } from "@/hooks/useRevenueData";
import { Loader2 } from "lucide-react";
import { Header } from "./Header";
import { RevenueChart } from "./RevenueChart";
import { RevenueDistribution } from "./RevenueDistribution";
import { RevenueFilters } from "./RevenueFilters";
import { RevenueStats } from "./RevenueStats";
import { Sidebar } from "./Sidebar";

const RevenueContent = () => {
  const {
    summary,
    chartData,
    sportDistribution,
    availableVenues,
    selectedVenue,
    setSelectedVenue,
    loading,
    error,
    selectedRange,
    setSelectedRange,
    navigate,
    canGoNext,
    canGoPrev,
    dateWindow,
  } = useRevenueData();

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-neutral-950 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#adfa1d]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-neutral-950 items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-[#adfa1d] selection:text-black">
      <Sidebar />
      <Header />

      <main className="lg:ml-[480px] p-4 md:p-8 pb-24 lg:pb-8 transition-all duration-300">
        <div className="lg:hidden mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Reports
          </h2>
        </div>

        <div className="space-y-6 max-w-[1600px] mx-auto">
          <RevenueFilters
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            selectedVenue={selectedVenue}
            setSelectedVenue={setSelectedVenue}
            availableVenues={availableVenues || []}
            navigate={navigate}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            dateWindow={dateWindow}
          />

          <div className="grid gap-6 grid-cols-1 2xl:grid-cols-3">
            <div className="2xl:col-span-2 space-y-6 order-2 2xl:order-1">
              <RevenueChart data={chartData} />
            </div>

            <div className="2xl:col-span-1 space-y-6 order-1 2xl:order-2">
              {summary && <RevenueStats summary={summary} />}
              {sportDistribution && (
                <RevenueDistribution data={sportDistribution} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenueContent;
