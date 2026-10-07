"use client";

import {
  Edit3,
  Power,
  PowerOff,
  Plane,
} from "lucide-react";

import type { FlightResponse } from "@/store/api/flightApi";

interface FlightTableProps {
  flights: FlightResponse[];
  onEdit: (flight: FlightResponse) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  isUpdating?: boolean;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatBaseFare(value: number) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function FlightTable({
  flights,
  onEdit,
  onActivate,
  onDeactivate,
  isUpdating = false,
}: FlightTableProps) {
  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Plane className="h-6 w-6 text-slate-400" />
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          No flights found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Create your first flight to start
          managing schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1250px] w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {/* Flight */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Flight
              </th>

              {/* Airline */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Airline
              </th>

              {/* Route */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Route
              </th>

              {/* Aircraft */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Aircraft
              </th>

              {/* Schedule */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Schedule
              </th>

              {/* Base Fare */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Base Fare
              </th>

              {/* Status */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              {/* Actions */}
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {flights.map((flight) => (
              <tr
                key={flight.id}
                className="transition hover:bg-slate-50/70"
              >
                {/* Flight */}
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {flight.flightNumber}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    ID: {flight.id}
                  </p>
                </td>

                {/* Airline */}
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800">
                    {flight.airlineName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {flight.airlineCode}
                  </p>
                </td>

                {/* Route */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                      {flight.departureAirportCode}
                    </span>

                    <span className="text-slate-300">
                      →
                    </span>

                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                      {flight.arrivalAirportCode}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {flight.departureAirportName}{" "}
                    → {flight.arrivalAirportName}
                  </p>
                </td>

                {/* Aircraft */}
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800">
                    {flight.aircraftModel}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {flight.aircraftRegistrationNumber}
                  </p>
                </td>

                {/* Schedule */}
                <td className="px-5 py-4">
                  <p className="text-xs font-medium text-slate-700">
                    DEP:{" "}
                    {formatDateTime(
                      flight.departureTime
                    )}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    ARR:{" "}
                    {formatDateTime(
                      flight.arrivalTime
                    )}
                  </p>
                </td>

                {/* Base Fare */}
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatBaseFare(
                      flight.baseFare
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Starting fare
                  </p>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      flight.active
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {flight.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(flight)
                      }
                      disabled={isUpdating}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                      title="Edit flight"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* Activate / Deactivate */}
                    {flight.active ? (
                      <button
                        type="button"
                        onClick={() =>
                          onDeactivate(
                            flight.id
                          )
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        title="Deactivate flight"
                      >
                        <PowerOff className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onActivate(
                            flight.id
                          )
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-green-100 p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                        title="Activate flight"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}