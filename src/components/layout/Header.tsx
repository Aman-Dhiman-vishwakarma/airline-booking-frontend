"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Plane,
  User,
  ChevronDown,
  LogOut,
  CalendarCheck,
  LayoutDashboard,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { clearCredentials } from "@/store/slices/authSlice";
import { showAlert } from "@/store/slices/uiSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(clearCredentials());

      dispatch(
        showAlert({
          type: "success",
          title: "Logged out",
          message: "You have been logged out successfully.",
        }),
      );

      router.push("/login");
    } catch (error) {
      dispatch(clearCredentials());
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => {
            setMobileMenuOpen(false);
            setProfileOpen(false);
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Plane className="h-5 w-5" />
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-bold tracking-tight text-slate-900">
              AirBook
            </p>

            <p className="-mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Fly with confidence
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Home */}
          <Link
            href="/"
            className="text-sm font-medium text-slate-900 transition hover:text-slate-600"
          >
            Home
          </Link>

          {/* My Bookings */}
          {isAuthenticated && (
            <Link
              href="/bookings"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <CalendarCheck className="h-4 w-4" />
              My Bookings
            </Link>
          )}

          {/* Admin Dashboard */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          {isInitialized && (
            <>
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((previous) => !previous)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>

                    <div className="hidden text-left lg:block">
                      <p className="text-sm font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>

                      <p className="text-xs text-slate-500">Account</p>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                      {/* Profile */}
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>

                      {/* Bookings */}
                      <Link
                        href="/bookings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <CalendarCheck className="h-4 w-4" />
                        My Bookings
                      </Link>

                      {/* Admin */}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="my-1 border-t border-slate-100" />

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
            >
              Home
            </Link>

            {/* My Bookings */}
            {/* My Bookings */}
            {isAuthenticated && (
              <Link
                href="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <CalendarCheck className="h-4 w-4" />
                My Bookings
              </Link>
            )}

            {/* Admin Dashboard */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            {/* Mobile Profile */}
            {isAuthenticated && user && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
            )}

            {isInitialized && (
              <div className="mt-2 border-t border-slate-100 pt-3">
                {isAuthenticated && user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
