"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  useGetAirportsQuery,
  type AirportResponse,
} from "@/store/api/airportApi";

const popularRoutes = [
  {
    from: "DEL",
    fromCity: "New Delhi",
    to: "BOM",
    toCity: "Mumbai",
  },
  {
    from: "DEL",
    fromCity: "New Delhi",
    to: "BLR",
    toCity: "Bengaluru",
  },
  {
    from: "DEL",
    fromCity: "New Delhi",
    to: "HYD",
    toCity: "Hyderabad",
  },
];

const features = [
  {
    icon: Search,
    title: "Easy flight search",
    description:
      "Find available flights by route and travel date with a simple and focused search experience.",
  },
  {
    icon: ShieldCheck,
    title: "Secure booking",
    description:
      "Your account and booking information are protected with secure authentication.",
  },
  {
    icon: CheckCircle2,
    title: "Instant confirmation",
    description:
      "Complete your booking in one flow and receive your confirmed booking details.",
  },
];

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HomePage() {
  const {
    data: airportsResponse,
    isLoading: airportsLoading,
  } = useGetAirportsQuery();

  const airports = useMemo(() => {
    return (airportsResponse?.data ?? []).filter(
      (airport: AirportResponse) => airport.active
    );
  }, [airportsResponse]);

  const [departureAirportCode, setDepartureAirportCode] =
    useState("");

  const [arrivalAirportCode, setArrivalAirportCode] =
    useState("");

  const [departureDate, setDepartureDate] =
    useState("");

  const [error, setError] = useState("");

  const today = getTodayDate();

  const handleSwap = () => {
    setDepartureAirportCode(arrivalAirportCode);
    setArrivalAirportCode(departureAirportCode);
    setError("");
  };

  const handleSearch = () => {
    setError("");

    if (!departureAirportCode) {
      setError("Please select your departure airport.");
      return;
    }

    if (!arrivalAirportCode) {
      setError("Please select your arrival airport.");
      return;
    }

    if (
      departureAirportCode === arrivalAirportCode
    ) {
      setError(
        "Departure and arrival airports must be different."
      );
      return;
    }

    if (!departureDate) {
      setError("Please select your departure date.");
      return;
    }

    if (departureDate < today) {
      setError(
        "Departure date cannot be in the past."
      );
      return;
    }

    const params = new URLSearchParams({
      departureAirportCode,
      arrivalAirportCode,
      departureDate,
    });

    window.location.href = `/flights?${params.toString()}`;
  };

  const handlePopularRoute = (
    from: string,
    to: string
  ) => {
    setDepartureAirportCode(from);
    setArrivalAirportCode(to);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-slate-800/50 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          {/* Hero content */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />

              Simple. Secure. Seamless.
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your journey starts{" "}
              <span className="text-slate-400">
                here.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Search available flights, choose your
              journey, and book your next trip with a
              smooth and secure airline booking
              experience.
            </p>
          </div>

          {/* SEARCH CARD */}
          <div className="mt-10 max-w-6xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
            {/* Heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                    <Search className="h-4 w-4 text-slate-900" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Search flights
                    </h2>

                    <p className="text-xs text-slate-500">
                      Find the right flight for your
                      journey.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 sm:flex">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure search
              </div>
            </div>

            {/* Search fields */}
            <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto_1fr_1fr_auto]">
              {/* FROM */}
              <div>
                <label
                  htmlFor="departureAirport"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  From
                </label>

                <div className="relative">
                  <Plane className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <select
                    id="departureAirport"
                    value={departureAirportCode}
                    onChange={(event) => {
                      setDepartureAirportCode(
                        event.target.value
                      );
                      setError("");
                    }}
                    disabled={airportsLoading}
                    className="h-14 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  >
                    <option value="">
                      {airportsLoading
                        ? "Loading airports..."
                        : "Select departure"}
                    </option>

                    {airports.map((airport) => (
                      <option
                        key={airport.id}
                        value={airport.code}
                      >
                        {airport.city} ({airport.code})
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* SWAP */}
              <div className="flex items-end justify-center pb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  disabled={
                    !departureAirportCode &&
                    !arrivalAirportCode
                  }
                  aria-label="Swap airports"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </div>

              {/* TO */}
              <div>
                <label
                  htmlFor="arrivalAirport"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  To
                </label>

                <div className="relative">
                  <Plane className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 rotate-90 -translate-y-1/2 text-slate-400" />

                  <select
                    id="arrivalAirport"
                    value={arrivalAirportCode}
                    onChange={(event) => {
                      setArrivalAirportCode(
                        event.target.value
                      );
                      setError("");
                    }}
                    disabled={airportsLoading}
                    className="h-14 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  >
                    <option value="">
                      {airportsLoading
                        ? "Loading airports..."
                        : "Select arrival"}
                    </option>

                    {airports.map((airport) => (
                      <option
                        key={airport.id}
                        value={airport.code}
                      >
                        {airport.city} ({airport.code})
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* DATE */}
              <div>
                <label
                  htmlFor="departureDate"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Departure
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="departureDate"
                    type="date"
                    min={today}
                    value={departureDate}
                    onChange={(event) => {
                      setDepartureDate(
                        event.target.value
                      );
                      setError("");
                    }}
                    className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Select your travel date
                </p>
              </div>

              {/* SEARCH */}
              <button
                type="button"
                onClick={handleSearch}
                className="flex min-h-14 items-center justify-center cursor-pointer gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search Flights
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Bottom note */}
            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />

              Search active flights available for your
              selected route and date.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Why AirBook
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Everything you need for a better booking
            experience.
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            From finding your route to completing your
            booking, AirBook keeps the experience simple
            and focused.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-900" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Explore routes
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Popular destinations
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Choose a popular route and continue with
              your travel date.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {popularRoutes.map((route) => (
              <button
                type="button"
                key={`${route.from}-${route.to}`}
                onClick={() =>
                  handlePopularRoute(
                    route.from,
                    route.to
                  )
                }
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {route.from}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {route.fromCity}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                    <Plane className="h-4 w-4 rotate-90 text-slate-500 transition group-hover:translate-x-1" />
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {route.to}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {route.toCity}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-xs font-medium text-slate-500">
                    Use this route
                  </span>

                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Clock3 className="h-6 w-6 text-white" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">
              Ready for your next journey?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Search available flights and start planning
              your next trip today.
            </p>

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Find a flight
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <Plane className="h-4 w-4 text-slate-700" />

            <span className="text-sm font-semibold text-slate-900">
              AirBook
            </span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 AirBook. Built for a seamless travel
            experience.
          </p>
        </div>
      </footer>
    </main>
  );
}