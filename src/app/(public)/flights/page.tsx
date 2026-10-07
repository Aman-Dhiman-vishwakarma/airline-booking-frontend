"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  Clock3,
  Plane,
  RefreshCw,
  Search,
  ShieldCheck,
  Luggage,
} from "lucide-react";

import {
  useSearchFlightsQuery,
  type FlightSearchResponse,
} from "@/store/api/flightSearchApi";

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDuration(departureTime: string, arrivalTime: string) {
  const departure = new Date(departureTime).getTime();
  const arrival = new Date(arrivalTime).getTime();

  if (
    Number.isNaN(departure) ||
    Number.isNaN(arrival) ||
    arrival <= departure
  ) {
    return "--";
  }

  const minutes = Math.round((arrival - departure) / 60000);

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatFare(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClasses(status: string) {
  switch (status) {
    case "SCHEDULED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";

    case "BOARDING":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";

    case "DELAYED":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200";

    default:
      return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
}

function getApiErrorMessage(error: unknown) {
  const apiError = error as {
    data?: {
      message?: string;
      data?: unknown;
    };
  };

  const data = apiError.data?.data;

  if (data && typeof data === "object") {
    const messages = Object.values(data)
      .filter((value): value is string => typeof value === "string")
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (data && typeof data === "string") {
    return data;
  }

  return (
    apiError.data?.message ?? "Unable to search flights. Please try again."
  );
}

function FlightCard({ flight }: { flight: FlightSearchResponse }) {
  const isCancelled = flight.status === "CANCELLED";
  const router = useRouter();

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        isCancelled
          ? "border-red-100"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Airline Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950">
            <Plane className="h-5 w-5 text-white" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-sm font-bold text-slate-950">
                {flight.airlineName}
              </p>

              <span className="text-slate-300">•</span>

              <p className="text-xs font-medium text-slate-500">
                {flight.airlineCode}
              </p>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Flight {flight.flightNumber}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
            flight.status,
          )}`}
        >
          {flight.status}
        </span>
      </div>

      {/* Main Flight Information */}
      <div className="px-5 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[1fr_180px_1fr] md:items-center">
          {/* Departure */}
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-950">
              {formatTime(flight.departureTime)}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                {flight.departureAirportCode}
              </span>

              <span className="text-xs text-slate-400">Departure</span>
            </div>

            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
              {flight.departureAirportName}
            </p>
          </div>

          {/* Flight Duration */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {getDuration(flight.departureTime, flight.arrivalTime)}
            </div>

            <div className="my-3 flex w-full items-center">
              <div className="h-px flex-1 bg-slate-200" />

              <div className="mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                <Plane className="h-3.5 w-3.5 rotate-90 text-slate-700" />
              </div>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Direct
            </span>
          </div>

          {/* Arrival */}
          <div className="md:text-right">
            <p className="text-3xl font-bold tracking-tight text-slate-950">
              {formatTime(flight.arrivalTime)}
            </p>

            <div className="mt-2 flex items-center gap-2 md:justify-end">
              <span className="text-base font-bold text-slate-900">
                {flight.arrivalAirportCode}
              </span>

              <span className="text-xs text-slate-400">Arrival</span>
            </div>

            <p className="mt-1 max-w-xs truncate text-xs text-slate-500 md:ml-auto">
              {flight.arrivalAirportName}
            </p>
          </div>
        </div>

        {/* Flight Details */}
        <div className="mt-7 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Departure date
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-800">
                {formatDate(flight.departureTime.slice(0, 10))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Plane className="h-4 w-4 shrink-0 text-slate-500" />

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Aircraft
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-800">
                {flight.aircraftModel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-500" />

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Registration
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-800">
                {flight.registrationNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-6 flex flex-col gap-5 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Luggage className="h-4 w-4 text-slate-400" />

            <span>Fare starts from</span>
          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <div className="text-right">
              <p className="text-xs text-slate-400">Starting from</p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {formatFare(flight.baseFare)}
              </p>
            </div>

            <button
              type="button"
              disabled={isCancelled}
              onClick={() => {
                if (!isCancelled) {
                  router.push(`/bookings/create?flightId=${flight.id}`);
                }
              }}
              className={`inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl px-5 py-3 text-sm font-semibold transition ${
                isCancelled
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-slate-950 text-white hover:bg-slate-800"
              }`}
            >
              {isCancelled ? "Unavailable" : "Select flight"}

              {!isCancelled && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FlightsPage() {
  const searchParams = useSearchParams();

  const departureAirportCode = searchParams.get("departureAirportCode") ?? "";

  const arrivalAirportCode = searchParams.get("arrivalAirportCode") ?? "";

  const departureDate = searchParams.get("departureDate") ?? "";

  const hasValidSearch =
    Boolean(departureAirportCode) &&
    Boolean(arrivalAirportCode) &&
    Boolean(departureDate) &&
    departureAirportCode !== arrivalAirportCode;

  const {
    data: response,
    error,
    isLoading,
    isFetching,
  } = useSearchFlightsQuery(
    {
      departureAirportCode,
      arrivalAirportCode,
      departureDate,
    },
    {
      skip: !hasValidSearch,
    },
  );

  const flights = useMemo(() => response?.data ?? [], [response]);

  const errorMessage = error ? getApiErrorMessage(error) : "";

  if (!hasValidSearch) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Search className="h-5 w-5 text-slate-700" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Search for a flight
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Select your departure airport, arrival airport and travel date to
              find available flights.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Search Summary Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Modify search
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
                  <Plane className="h-4 w-4 text-white" />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Flight Search
                </span>
              </div>

              <h1 className="mt-4 flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight text-slate-950">
                <span>{departureAirportCode}</span>

                <ArrowRight className="h-5 w-5 text-slate-300" />

                <span>{arrivalAirportCode}</span>
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4" />

                <span>{formatDate(departureDate)}</span>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure booking
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading || isFetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-6 w-48 rounded bg-slate-100" />

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="h-20 rounded-xl bg-slate-100" />
                  <div className="h-20 rounded-xl bg-slate-100" />
                  <div className="h-20 rounded-xl bg-slate-100" />
                </div>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="h-14 rounded-xl bg-slate-100" />
                  <div className="h-14 rounded-xl bg-slate-100" />
                  <div className="h-14 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <RefreshCw className="h-5 w-5 text-red-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              Unable to find flights
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {errorMessage}
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Modify search
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : flights.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Plane className="h-5 w-5 text-slate-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No flights found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any flights for this route and date. Try another
              date or route.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search another flight
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Result Summary */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {flights.length} {flights.length === 1 ? "flight" : "flights"}{" "}
                  found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing flights matching your search.
                </p>
              </div>

              <p className="text-xs font-medium text-slate-400">
                Sorted by departure time
              </p>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
