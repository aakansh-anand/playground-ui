import { Bell } from "lucide-react";

export const Header = () => {
  return (
    // Desktop: 250px height, offset by 480px sidebar
    // Mobile: Auto height, no offset
    <header className="lg:ml-[480px] p-6 pb-0 flex flex-col justify-end">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Revenue</h1>
        <div className="flex gap-4">
          <Bell className="w-5 h-5 text-neutral-400" />
        </div>
      </div>

      {/* Desktop Header Content */}
      <div className="hidden lg:flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Financial Overview
            </h2>
            <p className="text-neutral-400 text-sm">
              Track performance and manage revenue.
            </p>
          </div>
          {/* Removed Search */}
          <button className="p-2 bg-neutral-900 rounded-full border border-neutral-800 text-neutral-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
