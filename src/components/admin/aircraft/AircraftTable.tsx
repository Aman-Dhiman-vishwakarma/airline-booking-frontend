"use client";

import {
  CheckCircle2,
  Edit3,
  Loader2,
  Power,
  PowerOff,
} from "lucide-react";

import type { AircraftResponse } from "@/store/api/aircraftApi";

interface AircraftTableProps {
  aircraft: AircraftResponse[];
  isLoading: boolean;
  processingId: number | null;
  onEdit: (aircraft: AircraftResponse) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
}

export default function AircraftTable({
  aircraft,
  isLoading,
  processingId,
  onEdit,
  onActivate,
  onDeactivate,
}: AircraftTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading aircraft...
        </div>
      </div>
    );
  }

  if (aircraft.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Power className="h-5 w-5 text-slate-500" />
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          No aircraft found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Add your first aircraft to start managing the airline fleet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Aircraft
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Airline
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Registration
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Seats
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {aircraft.map((item) => {
              const isProcessing = processingId === item.id;

              return (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50/70"
                >
                  {/* Aircraft */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.model}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Aircraft #{item.id}
                      </p>
                    </div>
                  </td>

                  {/* Airline */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {item.airlineName}
                    </span>
                  </td>

                  {/* Registration */}
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                      {item.registrationNumber}
                    </span>
                  </td>

                  {/* Seats */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {item.totalSeats}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {item.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <PowerOff className="h-3.5 w-3.5" />
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        disabled={isProcessing}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      {item.active ? (
                        <button
                          type="button"
                          onClick={() => onDeactivate(item.id)}
                          disabled={isProcessing}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <PowerOff className="h-3.5 w-3.5" />
                          )}
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onActivate(item.id)}
                          disabled={isProcessing}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Power className="h-3.5 w-3.5" />
                          )}
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}