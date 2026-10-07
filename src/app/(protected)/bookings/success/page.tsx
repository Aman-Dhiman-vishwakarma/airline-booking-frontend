"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Plane,
  User,
  Armchair,
  Mail,
  Phone,
  CalendarDays,
  ArrowRight,
  Home,
} from "lucide-react";

import { useGetBookingByIdQuery } from "@/store/api/bookingApi";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();

  const bookingIdParam = searchParams.get("bookingId");
  const bookingId = bookingIdParam ? Number(bookingIdParam) : NaN;

  const {
    data,
    isLoading,
    isError,
  } = useGetBookingByIdQuery(bookingId, {
    skip: !Number.isInteger(bookingId) || bookingId <= 0,
  });

  const booking = data?.data;

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-slate-200" />

            <div className="mx-auto h-8 w-72 rounded bg-slate-200" />
            <div className="mx-auto h-5 w-96 max-w-full rounded bg-slate-200" />

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-6 w-48 rounded bg-slate-200" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="h-20 rounded-xl bg-slate-100" />
                <div className="h-20 rounded-xl bg-slate-100" />
                <div className="h-20 rounded-xl bg-slate-100" />
                <div className="h-20 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!bookingIdParam || !Number.isInteger(bookingId) || bookingId <= 0) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Plane className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Invalid booking
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            The booking information is missing or invalid.
          </p>

          <Link
            href="/flights"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Search flights
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  if (isError || !booking) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Plane className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Booking not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We could not find this booking. It may not exist or you may not
            have access to it.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="/bookings"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              My bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <section className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            Booking Confirmed
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Your flight has been booked successfully. Your seat has been
            automatically assigned.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Booking Reference:
            <span>{booking.bookingReference}</span>
          </div>
        </section>

        {/* Flight Details */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Plane className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Flight Details
                </h2>

                <p className="text-sm text-slate-500">
                  Flight {booking.flightNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <InfoItem
              icon={<Plane className="h-4 w-4" />}
              label="Flight Number"
              value={booking.flightNumber}
            />

            <InfoItem
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Booking Status"
              value={booking.status}
              valueClassName="text-emerald-600"
            />

            <InfoItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Booking ID"
              value={`#${booking.id}`}
            />

            <InfoItem
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Booking Reference"
              value={booking.bookingReference}
            />
          </div>
        </section>

        {/* Passengers */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <User className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Passenger Details
                </h2>

                <p className="text-sm text-slate-500">
                  {booking.passengers.length}{" "}
                  {booking.passengers.length === 1
                    ? "passenger"
                    : "passengers"}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {booking.passengers.map((passenger, index) => (
              <div
                key={passenger.id}
                className="grid gap-5 p-6 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Passenger {index + 1}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-950">
                    {passenger.firstName} {passenger.lastName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {passenger.gender} • DOB: {passenger.dateOfBirth}
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <Armchair className="h-4 w-4 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Assigned Seat</p>

                    <p className="font-bold text-slate-950">
                      {passenger.seat.seatNumber}
                    </p>

                    <p className="text-xs text-slate-500">
                      {passenger.seat.seatClass} • {passenger.seat.seatType}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact + Fare */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Contact Information
            </h2>

            <div className="mt-5 space-y-4">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={booking.contactEmail}
              />

              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={booking.contactPhone}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Booking Summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Passengers</span>
                <span>{booking.passengers.length}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Booking status</span>
                <span className="font-medium text-emerald-600">
                  {booking.status}
                </span>
              </div>

              <div className="my-3 border-t border-slate-200" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-950">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-slate-950">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </section>
      </div>
    </main>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoItem({
  icon,
  label,
  value,
  valueClassName = "text-slate-950",
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className={`mt-1 wrap-break-word text-sm font-semibold ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
}