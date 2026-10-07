"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plane,
  LayoutDashboard,
  Building2,
  PlaneTakeoff,
  MapPin,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { clearCredentials } from "@/store/slices/authSlice";
import { showAlert } from "@/store/slices/uiSlice";

interface AdminSidebarProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Airlines",
    href: "/admin/airlines",
    icon: Building2,
  },
  {
    name: "Aircraft",
    href: "/admin/aircraft",
    icon: PlaneTakeoff,
  },
  {
    name: "Airports",
    href: "/admin/airports",
    icon: MapPin,
  },
  {
    name: "Flights",
    href: "/admin/flights",
    icon: CalendarDays,
  },
];

export default function AdminSidebar({
  children,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleLogout = async () => {
    // Backend logout endpoint agar future mein add hota hai
    // to yahan API mutation call kar sakte hain.

    dispatch(clearCredentials());

    dispatch(
      showAlert({
        type: "success",
        title: "Logged out",
        message: "You have been logged out successfully.",
      })
    );

    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950">
            <Plane className="h-4 w-4 text-white" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Airline Booking
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Admin Panel
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <Plane className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Airline Booking
              </p>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 ${
                      active
                        ? "text-slate-950"
                        : "text-slate-500 group-hover:text-white"
                    }`}
                  />

                  {item.name}
                </span>

                {active && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <p className="truncate text-sm font-semibold text-white">
              {user
                ? `${user.firstName} ${user.lastName}`
                : "Administrator"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {user?.email ?? "Admin account"}
            </p>

            <span className="mt-2 inline-flex rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
              {user?.role ?? "ADMIN"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {children}
      </div>
    </div>
  );
}