import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "@/hooks/useRevenueData";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface RevenueFiltersProps {
  selectedRange: DateRange;
  setSelectedRange: Dispatch<SetStateAction<DateRange>>;
  selectedVenue: string;
  setSelectedVenue: Dispatch<SetStateAction<string>>;
  availableVenues: string[];
}

const RANGES: DateRange[] = ["7D", "1M", "3M", "1Y", "ALL"];

interface RevenueFiltersProps {
  selectedRange: DateRange;
  setSelectedRange: Dispatch<SetStateAction<DateRange>>;
  selectedVenue: string;
  setSelectedVenue: Dispatch<SetStateAction<string>>;
  availableVenues: string[];
  navigate: (direction: -1 | 1) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  dateWindow: { start: Date; end: Date };
}

export const RevenueFilters = ({
  selectedRange,
  setSelectedRange,
  selectedVenue,
  setSelectedVenue,
  availableVenues,
  navigate,
  canGoNext,
  canGoPrev,
  dateWindow,
}: RevenueFiltersProps) => {
  const formatDateDisplay = () => {
    if (selectedRange === "ALL") return "All Time";
    const { start, end } = dateWindow;

    if (selectedRange === "7D") {
      // "Week of Jan 1" or "Jan 1 - Jan 7"
      // User requested: "7D = Monday - Sunday"
      // Let's show "Jan 05 - Jan 11"
      return `${start.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("default", { month: "short", day: "numeric" })}`;
    }

    if (selectedRange === "1M") {
      return start.toLocaleDateString("default", {
        month: "long",
        year: "numeric",
      });
    }

    if (selectedRange === "3M") {
      return `${start.toLocaleDateString("default", { month: "short", year: "numeric" })} - ${end.toLocaleDateString("default", { month: "short", year: "numeric" })}`;
    }

    if (selectedRange === "1Y") {
      return start.getFullYear().toString();
    }

    return "";
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Top Row: Navigation and Range/Venue Selection */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Navigation & Label */}
        <div className="flex items-center gap-4 order-2 md:order-1">
          {selectedRange !== "ALL" && (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button
                onClick={() => navigate(-1)}
                disabled={!canGoPrev}
                className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-medium text-white px-2">
                {formatDateDisplay()}
              </span>
              <button
                onClick={() => navigate(1)}
                disabled={!canGoNext}
                className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 order-1 md:order-2 w-full md:w-auto">
          <div className="space-y-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <label className="text-sm text-neutral-400">Range</label>
            <div className="bg-neutral-900 rounded-lg p-1 flex border border-neutral-800 w-fit min-w-max">
              {RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all font-medium ${
                    selectedRange === range
                      ? "bg-[#adfa1d] text-black shadow-lg shadow-[#adfa1d]/20"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Venue</label>
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger className="w-[200px] bg-neutral-900 border-neutral-800 text-white">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-neutral-500" />
                  <SelectValue placeholder="Select Venue" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                {availableVenues.map((venue) => (
                  <SelectItem key={venue} value={venue}>
                    {venue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
