import { useEffect, useMemo, useState } from "react";

export type BookingGroup = {
  booking_group_id: string;
  user_id?: string;
  owner_id?: string;
  bookings?: string[];
  ground_name?: string;
  venue_name?: string;
  guest_name?: string;
  guest_phone?: string;
  sport: string;
  total_amount: number;
  status: string;
  razorpay_order_id?: string;
  created_at?: string;
  start_datetime: string;
  duration?: number;
  max_players?: number;
  cut_off_mins?: number;
  visibility?: string;
  type?: "BOOKING" | "TOURNAMENT";
};

export type SummaryMetrics = {
  totalRevenue: number;
  totalBookings: number;
  totalTournaments: number;
  growth: string;
};

export type ChartDataPoint = {
  label: string;
  booking: number;
  tournament: number;
  date: string;
};

export type DateRange = "7D" | "1M" | "3M" | "1Y" | "ALL";

export const useRevenueData = () => {
  const [allBookings, setAllBookings] = useState<BookingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRange, setSelectedRange] = useState<DateRange>("7D");
  const [selectedVenue, setSelectedVenue] = useState<string>("All Venues");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/revenue.json");
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }
        const result = await response.json();
        const list = result.bookings || [];
        setAllBookings(list);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Get Venues
  const availableVenues = useMemo(() => {
    const venues = new Set(
      allBookings.map((b) => b.venue_name).filter((v): v is string => !!v),
    );
    return ["All Venues", ...Array.from(venues)];
  }, [allBookings]);

  // 2. Filter by Venue
  const venueFilteredBookings = useMemo(() => {
    if (selectedVenue === "All Venues") return allBookings;
    return allBookings.filter((b) => b.venue_name === selectedVenue);
  }, [allBookings, selectedVenue]);

  // Max Booking Date (Constraint)
  const maxBookingDate = useMemo(() => {
    if (venueFilteredBookings.length === 0) return new Date();
    const maxTs = Math.max(
      ...venueFilteredBookings.map((b) => new Date(b.start_datetime).getTime()),
    );
    return new Date(maxTs);
  }, [venueFilteredBookings]);

  // View Date: Controls the *Start* of the current view window
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Reset View Date when Range/Venue changes (snap to latest)
  useEffect(() => {
    // Snap to the period containing maxBookingDate
    const d = new Date(maxBookingDate);
    // Align based on range types will happen in dateWindow calculation,
    // but here we just want to set the "anchor" around the latest data.
    setViewDate(d);
  }, [selectedRange, selectedVenue, maxBookingDate]);

  // 3. Calculate Strict Date Window
  const dateWindow = useMemo(() => {
    // Clone viewDate to avoid mutation issues
    const current = new Date(viewDate);
    const start = new Date(current);
    const end = new Date(current);

    // Normalize start time
    start.setHours(0, 0, 0, 0);

    switch (selectedRange) {
      case "7D": {
        // Monday - Sunday
        const day = start.getDay(); // 0=Sun, 1=Mon...
        // If Sunday (0), diff is -6. If Mon (1), diff is 0. If Tue (2), diff is -1.
        const diff = day === 0 ? -6 : 1 - day;
        start.setDate(start.getDate() + diff);

        end.setTime(start.getTime());
        end.setDate(start.getDate() + 6);
        break;
      }
      case "1M": {
        // 1st - Last of Month
        start.setDate(1);
        end.setTime(start.getTime());
        end.setMonth(start.getMonth() + 1);
        end.setDate(0); // Last day of previous month (which is our current month)
        break;
      }
      case "3M": {
        // 3 Month Block. User said "01/01 - 31/03".
        // We assume we want to align to quarters or just strict 3M blocks?
        // "lets say user is viewing jan 2026... back... Dec 2025" -> This implies 1M steps for some views?
        // But for 3M view: "3M = 01/01 - 31/03".
        // Let's align start to the Quarter? Or just 1st of the month...
        // Let's assume standard quarters for strictness: Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec.
        // OR just strict 3M blocks starting from Jan?
        // Let's align to the start of the quarter containing the viewDate.
        const currentMonth = start.getMonth();
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        start.setMonth(quarterStartMonth, 1);

        end.setTime(start.getTime());
        end.setMonth(start.getMonth() + 3);
        end.setDate(0);
        break;
      }
      case "1Y": {
        // Jan 1 - Dec 31
        start.setMonth(0, 1);
        end.setTime(start.getTime());
        end.setFullYear(start.getFullYear() + 1);
        end.setMonth(0, 0); // Last day of previous year
        break;
      }
      case "ALL": {
        // Full Range
        if (venueFilteredBookings.length > 0) {
          const minTs = Math.min(
            ...venueFilteredBookings.map((b) =>
              new Date(b.start_datetime).getTime(),
            ),
          );
          start.setTime(minTs);
          // start.setFullYear(2023, 0, 1); // Or fixed start?
        } else {
          start.setFullYear(2023, 0, 1);
        }
        end.setTime(maxBookingDate.getTime());
        end.setFullYear(end.getFullYear() + 1); // Buffer
        break;
      }
    }

    // Normalize end time
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, [selectedRange, viewDate, maxBookingDate, venueFilteredBookings]);

  // Navigation Logic
  const navigate = (direction: -1 | 1) => {
    setViewDate((prev) => {
      const next = new Date(prev);
      switch (selectedRange) {
        case "7D":
          next.setDate(next.getDate() + direction * 7);
          break;
        case "1M":
          next.setMonth(next.getMonth() + direction);
          break;
        case "3M":
          next.setMonth(next.getMonth() + direction * 3);
          break;
        case "1Y":
          next.setFullYear(next.getFullYear() + direction);
          break;
        case "ALL":
          // No navigation
          break;
      }
      return next;
    });
  };

  const canGoNext = useMemo(() => {
    if (selectedRange === "ALL") return false;
    // If current window end is >= maxBookingDate, we can't go further?
    // User said "user can't go to more then it's available bookings".
    // If the *next* period starts AFTER maxBookingDate, disable.
    // Or if the current period *contains* maxBookingDate, disable next?
    // Usually if we are at the edge, Next is disabled.
    return dateWindow.end < maxBookingDate;
  }, [dateWindow, maxBookingDate, selectedRange]);

  const canGoPrev = useMemo(() => {
    if (selectedRange === "ALL") return false;
    // Maybe restrict to 2023 (start of data)?
    return true;
  }, [selectedRange]);

  // 4. Filter Bookings by Date Window
  const windowBookings = useMemo(() => {
    return venueFilteredBookings.filter((b) => {
      const d = new Date(b.start_datetime);
      return d >= dateWindow.start && d <= dateWindow.end;
    });
  }, [venueFilteredBookings, dateWindow]);

  // 5. Dynamic Summary (unchanged logic, re-using windowBookings)
  const summary = useMemo<SummaryMetrics>(() => {
    let revenue = 0;
    let bookingsCount = 0;
    let tournamentsCount = 0;

    windowBookings.forEach((b) => {
      revenue += b.total_amount;
      if (b.type === "TOURNAMENT") {
        tournamentsCount++;
      } else {
        bookingsCount++;
      }
    });

    return {
      totalRevenue: revenue,
      totalBookings: bookingsCount,
      totalTournaments: tournamentsCount,
      growth: "0%",
    };
  }, [windowBookings]);

  // 6. Generate Chart Data
  const chartData = useMemo(() => {
    const map = new Map<string, ChartDataPoint>();

    let granularity: "day" | "week" | "month" = "day";
    // User requested less clutter for 3M, so we use week.
    if (selectedRange === "3M") granularity = "week";
    else if (["1Y", "ALL"].includes(selectedRange)) granularity = "month";

    // Helper to generate Label and Key
    const getLocalKey = (date: Date, mode: typeof granularity) => {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const d = date.getDate().toString().padStart(2, "0");

      if (mode === "month") {
        return {
          key: `${y}-${m}`,
          label: date.toLocaleDateString("default", {
            month: "short",
            year: "2-digit",
          }),
        };
      }

      if (mode === "week") {
        // Get start of week (Monday)
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date);
        monday.setDate(diff);
        const monY = monday.getFullYear();
        const monM = (monday.getMonth() + 1).toString().padStart(2, "0");
        const monD = monday.getDate().toString().padStart(2, "0");
        const label = monday.toLocaleDateString("default", {
          day: "numeric",
          month: "short",
        });
        return { key: `${monY}-${monM}-${monD}`, label: label };
      }

      // Default Day
      return {
        key: `${y}-${m}-${d}`,
        label: date.toLocaleDateString("default", {
          day: "numeric",
          month: "short",
        }),
      };
    };

    // Generic loop based on granularity increment
    const current = new Date(dateWindow.start);
    // Align start is handled by dateWindow logic mostly, but week alignment safety:
    if (granularity === "week") {
      const day = current.getDay();
      const diff = current.getDate() - day + (day === 0 ? -6 : 1);
      current.setDate(diff);
    } else if (granularity === "month") {
      current.setDate(1);
    }

    let loops = 0;
    // We might go slightly past dateWindow.end to cover the last bucket
    while (current <= dateWindow.end && loops < 1000) {
      // CONSTRAINT: Restrict line chart to maxBookingDate
      if (current > maxBookingDate && selectedRange !== "ALL") {
        // Stop generating points if we are purely in the future relative to data
        // However, user said "restrict the line... to end there".
        // If we just stop the loop, the line stops.
        break;
      }

      const { key, label } = getLocalKey(current, granularity);

      if (!map.has(key)) {
        map.set(key, { label, booking: 0, tournament: 0, date: key });
      }

      if (granularity === "day") current.setDate(current.getDate() + 1);
      else if (granularity === "week") current.setDate(current.getDate() + 7);
      else if (granularity === "month")
        current.setMonth(current.getMonth() + 1);

      loops++;
    }

    // Populate Data
    windowBookings.forEach((b) => {
      const d = new Date(b.start_datetime);
      // Skip if out of window (though it should be filtered already, but week alignment might shift things)
      const { key } = getLocalKey(d, granularity);

      // If map doesn't generate this key (e.g. data is slightly outside the visual loop), skip or add?
      // For safety, mainly we care about buckets we initialized.
      const entry = map.get(key);
      if (entry) {
        if (b.type === "TOURNAMENT") entry.tournament += b.total_amount;
        else entry.booking += b.total_amount;
      }
    });

    return Array.from(map.values());
  }, [windowBookings, selectedRange, dateWindow]);

  // 7. Sport Distribution (Filtered by Window)
  const sportDistribution = useMemo(() => {
    const map = new Map<string, number>();
    windowBookings.forEach((b) => {
      const s = b.sport || "Other";
      map.set(s, (map.get(s) || 0) + b.total_amount);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [windowBookings]);

  // 8. Daily Revenue for Heatmap (All time)
  const dailyRevenue = useMemo(() => {
    const map = new Map<string, number>();
    venueFilteredBookings.forEach((b) => {
      const d = new Date(b.start_datetime);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + b.total_amount);
    });
    return Array.from(map.entries()).map(([date, value]) => ({ date, value }));
  }, [venueFilteredBookings]);

  return {
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
    dailyRevenue,
    navigate,
    canGoNext,
    canGoPrev,
    dateWindow,
  };
};
