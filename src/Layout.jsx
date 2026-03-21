import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Plus,
  BarChart3,
  History,
  Target,
  Leaf,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Log Activity", icon: Plus, page: "LogActivity" },
  { name: "Insights", icon: BarChart3, page: "Insights" },
  { name: "History", icon: History, page: "History" },
  { name: "Challenges", icon: Target, page: "Challenges" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Eco<span className="text-emerald-600">Track</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}