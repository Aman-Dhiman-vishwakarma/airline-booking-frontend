"use client";

import {
  Edit3,
  Loader2,
  Power,
  PowerOff,
} from "lucide-react";

import type { AirlineResponse } from "@/store/api/airlineApi";

interface AirlineTableProps {
  airlines: AirlineResponse[];
  isLoading: boolean;
  actionLoadingId: number | null;
  onEdit: (airline: AirlineResponse) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
}

export default function AirlineTable({
  airlines,
  isLoading,
  actionLoadingId,
  onEdit,
  onActivate,
  onDeactivate,
}: AirlineTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading airlines...
        </div>
      </div>
    );
  }

  if (airlines.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Power className="h-5 w-5 text-slate-500" />
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          No airlines found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Create your first airline to start managing airline data.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Airline
            </th>

            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Code
            </th>

            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Created
            </th>

            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {airlines.map((airline) => {
            const isActionLoading =
              actionLoadingId === airline.id;

            return (
              <tr
                key={airline.id}
                className="transition hover:bg-slate-50/70"
              >
                {/* Airline */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                      {airline.code
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {airline.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        ID #{airline.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Code */}
                <td className="px-6 py-4">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                    {airline.code}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {airline.active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Inactive
                    </span>
                  )}
                </td>

                {/* Created */}
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(
                    airline.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(airline)}
                      disabled={isActionLoading}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    {airline.active ? (
                      <button
                        type="button"
                        onClick={() =>
                          onDeactivate(airline.id)
                        }
                        disabled={isActionLoading}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <PowerOff className="h-3.5 w-3.5" />
                        )}

                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onActivate(airline.id)
                        }
                        disabled={isActionLoading}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isActionLoading ? (
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
  );
}