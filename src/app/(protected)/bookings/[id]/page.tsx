"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  Phone,
  Plane,
  ReceiptText,
  User,
  Armchair,
  XCircle,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { useGetBookingByIdQuery } from "@/store/api/bookingApi";

export default function BookingDetailsPage() {
  const params = useParams();

  const bookingIdParam = params.id;
  const bookingId =
    typeof bookingIdParam === "string" ? Number(bookingIdParam) : NaN;

  const { data, isLoading, isError, refetch } = useGetBookingByIdQuery(
    bookingId,
    {
      skip: !Number.isInteger(bookingId) || bookingId <= 0,
    },
  );

  const booking = data?.data;

  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  if (
    !Number.isInteger(bookingId) ||
    bookingId <= 0 ||
    isError ||
    !booking
  ) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Booking not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              We could not find the requested booking or you may not have
              permission to view it.
            </p>

            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Try again
              </button>
            )}

            <div className="mt-4">
              <Link
                href="/bookings"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to My Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const status = getStatusConfig(booking.status);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Bookings
        </Link>

        {/* Header */}
        <section className="mt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Booking Details
                </h1>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                >
                  {status.icon}
                  {booking.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                Booking reference:{" "}
                <span className="font-bold text-slate-950">
                  {booking.bookingReference}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total amount
              </p>

              <p className="mt-1 text-xl font-bold text-slate-950">
                ₹{booking.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </section>

        {/* Flight */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Plane className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Flight Information
                </h2>

                <p className="text-sm text-slate-500">
                  Your booked flight
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              icon={<Plane className="h-4 w-4" />}
              label="Flight Number"
              value={booking.flightNumber}
            />

            <DetailItem
              icon={<ReceiptText className="h-4 w-4" />}
              label="Booking Reference"
              value={booking.bookingReference}
            />

            <DetailItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Booking Date"
              value={formatDate(booking.createdAt)}
            />

            <DetailItem
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Status"
              value={booking.status}
              valueClassName="text-emerald-600"
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
                  Passenger & Seat Details
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
              <div key={passenger.id} className="p-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                  {/* Passenger */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Passenger {index + 1}
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-950">
                      {passenger.firstName} {passenger.lastName}
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <DetailItem
                        icon={<User className="h-4 w-4" />}
                        label="Gender"
                        value={passenger.gender}
                      />

                      <DetailItem
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Date of Birth"
                        value={formatDateOnly(passenger.dateOfBirth)}
                      />
                    </div>
                  </div>

                  {/* Seat */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:min-w-55">
                    <div className="flex items-center gap-2">
                      <Armchair className="h-5 w-5 text-slate-700" />

                      <p className="text-sm font-semibold text-slate-950">
                        Assigned Seat
                      </p>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-slate-950">
                      {passenger.seat?.seatNumber ?? "—"}
                    </p>

                    {passenger.seat && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-slate-600">
                          Class:{" "}
                          <span className="font-semibold text-slate-800">
                            {passenger.seat.seatClass}
                          </span>
                        </p>

                        <p className="text-sm text-slate-600">
                          Type:{" "}
                          <span className="font-semibold text-slate-800">
                            {passenger.seat.seatType}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Mail className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Contact Email
                </h2>

                <p className="mt-1 break-all text-sm text-slate-600">
                  {booking.contactEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Phone className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Contact Phone
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {booking.contactPhone}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Summary */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-950">
            Booking Summary
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Flight</span>
              <span className="font-semibold text-slate-900">
                {booking.flightNumber}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Passengers</span>
              <span className="font-semibold text-slate-900">
                {booking.passengers.length}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Booking status</span>
              <span className="font-semibold text-emerald-600">
                {booking.status}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-950">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-slate-950">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            My Bookings
          </Link>

          <Link
            href="/flights"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Book Another Flight
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function DetailItem({
  icon,
  label,
  value,
  valueClassName = "text-slate-950",
}: DetailItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 wrap-break-word text-sm font-semibold ${valueClassName}`}
        >
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

function formatDateOnly(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BookingDetailsSkeleton() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-5 w-36 rounded bg-slate-200" />

        <div className="mt-7 flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-9 w-56 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-200" />
          </div>

          <div className="h-16 w-36 rounded-xl bg-slate-200" />
        </div>

        <SkeletonSection />

        <SkeletonSection />

        <SkeletonSection />
      </div>
    </main>
  );
}

function SkeletonSection() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="h-6 w-48 rounded bg-slate-200" />

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}