"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  ReceiptText,
  Users,
  XCircle,
} from "lucide-react";

import { useGetMyBookingsQuery } from "@/store/api/bookingApi";

export default function MyBookingsPage() {
  const { data, isLoading, isError, refetch } = useGetMyBookingsQuery();

  const bookings = data?.data ?? [];

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Your travel history
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                My Bookings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                View your upcoming and previous flight bookings, passenger
                details, assigned seats, and booking information.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Book a flight
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Loading */}
        {isLoading && <BookingsSkeleton />}

        {/* Error */}
        {!isLoading && isError && (
          <section className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-7 w-7 text-red-500" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              Unable to load bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              We could not fetch your bookings right now. Please try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try again
            </button>
          </section>
        )}

        {/* Empty */}
        {!isLoading && !isError && bookings.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Plane className="h-8 w-8 text-slate-500" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-950">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              You haven't booked any flights yet. Search for a flight and make
              your first booking.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search flights
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {/* Booking List */}
        {!isLoading && !isError && bookings.length > 0 && (
          <section className="space-y-5">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

interface BookingCardProps {
  booking: {
    id: number;
    bookingReference: string;
    flightId: number;
    flightNumber: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    contactEmail: string;
    contactPhone: string;
    totalAmount: number;
    passengers: {
      id: number;
      firstName: string;
      lastName: string;
      gender: "MALE" | "FEMALE" | "OTHER";
      dateOfBirth: string;
      seat: {
        seatId: number;
        seatNumber: string;
        seatClass: string;
        seatType: string;
      };
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

function BookingCard({ booking }: BookingCardProps) {
  const status = getStatusConfig(booking.status);

  const passengerCount = booking.passengers.length;

  const seats = booking.passengers
    .map((passenger) => passenger.seat?.seatNumber)
    .filter(Boolean);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Top */}
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Plane className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-950">
                Flight {booking.flightNumber}
              </h2>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
              >
                {status.icon}
                {booking.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Booking reference:{" "}
              <span className="font-semibold text-slate-700">
                {booking.bookingReference}
              </span>
            </p>
          </div>
        </div>

        <Link
          href={`/bookings/${booking.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Details */}
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
        <BookingInfo
          icon={<CalendarDays className="h-4 w-4" />}
          label="Booked on"
          value={formatDate(booking.createdAt)}
        />

        <BookingInfo
          icon={<Users className="h-4 w-4" />}
          label="Passengers"
          value={`${passengerCount} ${
            passengerCount === 1 ? "passenger" : "passengers"
          }`}
        />

        <BookingInfo
          icon={<ReceiptText className="h-4 w-4" />}
          label="Total amount"
          value={`₹${booking.totalAmount.toLocaleString("en-IN")}`}
        />

        <BookingInfo
          icon={<Plane className="h-4 w-4" />}
          label="Seats"
          value={seats.length > 0 ? seats.join(", ") : "Not assigned"}
        />
      </div>

      {/* Passenger summary */}
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Passengers
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {booking.passengers
                .map(
                  (passenger) =>
                    `${passenger.firstName} ${passenger.lastName}`,
                )
                .join(", ")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-4 w-4" />
            <span>Booking #{booking.id}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

interface BookingInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function BookingInfo({ icon, label, value }: BookingInfoProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function getStatusConfig(status: string) {
  switch (status) {
    case "CONFIRMED":
      return {
        className: "bg-emerald-50 text-emerald-700",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      };

    case "CANCELLED":
      return {
        className: "bg-red-50 text-red-700",
        icon: <XCircle className="h-3.5 w-3.5" />,
      };

    case "PENDING":
    default:
      return {
        className: "bg-amber-50 text-amber-700",
        icon: <Clock3 className="h-3.5 w-3.5" />,
      };
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BookingsSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-slate-200" />

              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-44 rounded bg-slate-200" />
              </div>
            </div>

            <div className="h-10 w-28 rounded-xl bg-slate-200" />
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((column) => (
              <div key={column} className="space-y-2">
                <div className="h-3 w-20 rounded bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}