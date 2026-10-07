"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  PlaneTakeoff,
  Plus,
} from "lucide-react";

import { useGetAirlinesQuery } from "@/store/api/airlineApi";
import { useGetAircraftQuery } from "@/store/api/aircraftApi";
import { useGetAirportsQuery } from "@/store/api/airportApi";
import { useGetFlightsQuery } from "@/store/api/flightApi";

interface StatCardProps {
  title: string;
  value: number;
  active: number;
  icon: React.ElementType;
  href: string;
}

function StatCard({ title, value, active, icon: Icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>

        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          {value}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <Activity className="h-3.5 w-3.5" />
            {active} active
          </span>

          <span className="text-xs text-slate-400">currently</span>
        </div>
      </div>
    </Link>
  );
}

interface ManagementCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  action: string;
}

function ManagementCard({
  title,
  description,
  href,
  icon: Icon,
  action,
}: ManagementCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon className="h-5 w-5" />
        </div>

        <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-900" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        {action}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data: airlinesData, isLoading: airlinesLoading } =
    useGetAirlinesQuery();

  const { data: aircraftData, isLoading: aircraftLoading } =
    useGetAircraftQuery();

  const { data: airportsData, isLoading: airportsLoading } =
    useGetAirportsQuery();

  const { data: flightsData, isLoading: flightsLoading } = useGetFlightsQuery();

  const airlines = airlinesData?.data ?? [];
  const aircraft = aircraftData?.data ?? [];
  const airports = airportsData?.data ?? [];
  const flights = flightsData?.data ?? [];

  const isLoading =
    airlinesLoading || aircraftLoading || airportsLoading || flightsLoading;

  const activeAirlines = airlines.filter((item) => item.active).length;

  const activeAircraft = aircraft.filter((item) => item.active).length;

  const activeAirports = airports.filter((item) => item.active).length;

  const activeFlights = flights.filter((item) => item.active).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex min-h-20 items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your airline booking platform from one place.
            </p>
          </div>

          <Link
            href="/admin/flights"
            className="hidden items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex"
          >
            <Plus className="h-4 w-4" />
            Manage Flights
          </Link>
        </div>
      </header>

      <div className="p-5 sm:p-8">
        {/* Stats */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-950">
              Platform overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current airline infrastructure at a glance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Airlines"
              value={isLoading ? 0 : airlines.length}
              active={isLoading ? 0 : activeAirlines}
              icon={Building2}
              href="/admin/airlines"
            />

            <StatCard
              title="Total Aircraft"
              value={isLoading ? 0 : aircraft.length}
              active={isLoading ? 0 : activeAircraft}
              icon={PlaneTakeoff}
              href="/admin/aircraft"
            />

            <StatCard
              title="Total Airports"
              value={isLoading ? 0 : airports.length}
              active={isLoading ? 0 : activeAirports}
              icon={MapPin}
              href="/admin/airports"
            />

            <StatCard
              title="Total Flights"
              value={isLoading ? 0 : flights.length}
              active={isLoading ? 0 : activeFlights}
              icon={CalendarDays}
              href="/admin/flights"
            />
          </div>
        </section>

        {/* Management */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-950">Management</h2>

            <p className="mt-1 text-sm text-slate-500">
              Quickly access and manage your core airline resources.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <ManagementCard
              title="Airlines"
              description="Create, update and manage airline companies and their active status."
              href="/admin/airlines"
              icon={Building2}
              action="Manage airlines"
            />

            <ManagementCard
              title="Aircraft"
              description="Manage aircraft, airline assignments, registrations and seat capacity."
              href="/admin/aircraft"
              icon={PlaneTakeoff}
              action="Manage aircraft"
            />

            <ManagementCard
              title="Airports"
              description="Manage airports, airport codes, cities, countries and availability."
              href="/admin/airports"
              icon={MapPin}
              action="Manage airports"
            />

            <ManagementCard
              title="Flights"
              description="Create and manage flight schedules, routes, fares and flight status."
              href="/admin/flights"
              icon={CalendarDays}
              action="Manage flights"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Ready to manage flights?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Airlines, aircraft and airports are ready. Continue with
                  flight scheduling.
                </p>
              </div>

              <Link
                href="/admin/flights"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Open Flight Management
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
