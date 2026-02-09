import { Calendar, Home, Settings, Trophy, User, Wallet } from "lucide-react";

export const Sidebar = () => {
  const links = [
    { icon: <Home className="w-6 h-6" />, label: "Home", active: false },
    { icon: <Wallet className="w-6 h-6" />, label: "Revenue", active: true },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: "Bookings",
      active: false,
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: "Tournaments",
      active: false,
    },
    { icon: <User className="w-6 h-6" />, label: "Profile", active: false },
  ];

  return (
    <>
      {/* Desktop Sidebar (480px) */}
      <div className="hidden lg:flex flex-col w-[350px] h-screen bg-neutral-900 border-r border-neutral-800 fixed left-0 top-0 overflow-y-auto p-8 z-50">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tighter">
            VENUE<span className="text-[#adfa1d]">MANAGER</span>
          </h1>
        </div>

        <nav className="space-y-4 flex-1">
          {links.map((link) => (
            <button
              key={link.label}
              className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all ${
                link.active
                  ? "bg-[#adfa1d] text-black font-bold shadow-lg shadow-[#adfa1d]/20"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="text-lg">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-neutral-800">
          <button className="flex items-center gap-4 w-full p-4 text-neutral-400 hover:text-white">
            <Settings className="w-6 h-6" />
            <span className="text-lg">Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50 pb-safe">
        <div className="flex justify-around items-center p-4">
          {links.slice(0, 5).map((link) => (
            <button
              key={link.label}
              className={`flex flex-col items-center gap-1 ${link.active ? "text-[#adfa1d]" : "text-neutral-500"}`}
            >
              {link.icon}
              <span className="text-[10px] font-medium">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
