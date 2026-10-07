"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  Plane,
  XCircle,
} from "lucide-react";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

import { showAlert } from "@/store/slices/uiSlice";

import {
  useGetFlightsQuery,
  useCreateFlightMutation,
  useUpdateFlightMutation,
  useActivateFlightMutation,
  useDeactivateFlightMutation,
  type FlightRequest,
  type FlightResponse,
} from "@/store/api/flightApi";

import FlightForm from "@/components/admin/flights/FlightForm";
import FlightTable from "@/components/admin/flights/FlightTable";

export default function FlightsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: flightsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetFlightsQuery();

  const [createFlight, { isLoading: isCreating }] =
    useCreateFlightMutation();

  const [updateFlight, { isLoading: isUpdating }] =
    useUpdateFlightMutation();

  const [activateFlight, { isLoading: isActivating }] =
    useActivateFlightMutation();

  const [deactivateFlight, { isLoading: isDeactivating }] =
    useDeactivateFlightMutation();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingFlight, setEditingFlight] =
    useState<FlightResponse | null>(null);

  const flights = flightsResponse?.data ?? [];

  /*
   * Extract error message from backend response.
   *
   * Success response:
   * {
   *   success: true,
   *   message: "...",
   *   data: { ...flight }
   * }
   *
   * Error response:
   * {
   *   success: false,
   *   message: "Validation failed",
   *   data: {
   *     baseFare: "Base fare is required"
   *   }
   * }
   *
   * We NEVER print success.data because it contains
   * the complete Flight object.
   *
   * For errors, however, data can contain field-level
   * validation messages, so we extract and display them.
   */
  const getApiErrorMessage = (error: unknown): string => {
    const apiError = error as {
      data?: {
        message?: string;
        data?: unknown;
      };
    };

    const errorData = apiError?.data?.data;

    /*
     * Case 1:
     * data is an object containing validation messages.
     *
     * Example:
     * {
     *   baseFare: "Base fare is required",
     *   flightNumber: "Flight number is required"
     * }
     */
    if (
      errorData &&
      typeof errorData === "object" &&
      !Array.isArray(errorData)
    ) {
      const messages = Object.values(
        errorData as Record<string, unknown>
      )
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
        .join(", ");

      if (messages) {
        return messages;
      }
    }

    /*
     * Case 2:
     * data itself is a string.
     */
    if (
      typeof errorData === "string" &&
      errorData.trim()
    ) {
      return errorData;
    }

    /*
     * Case 3:
     * Backend only sends the top-level message.
     */
    if (
      typeof apiError?.data?.message === "string" &&
      apiError.data.message.trim()
    ) {
      return apiError.data.message;
    }

    return "Something went wrong. Please try again.";
  };

  const filteredFlights = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return flights;
    }

    return flights.filter((flight) => {
      return (
        flight.flightNumber
          .toLowerCase()
          .includes(query) ||
        flight.airlineName
          .toLowerCase()
          .includes(query) ||
        flight.airlineCode
          .toLowerCase()
          .includes(query) ||
        flight.departureAirportCode
          .toLowerCase()
          .includes(query) ||
        flight.arrivalAirportCode
          .toLowerCase()
          .includes(query) ||
        flight.aircraftRegistrationNumber
          .toLowerCase()
          .includes(query)
      );
    });
  }, [flights, search]);

  const activeCount = flights.filter(
    (flight) => flight.active
  ).length;

  const inactiveCount = flights.filter(
    (flight) => !flight.active
  ).length;

  const handleCreate = async (
    data: FlightRequest
  ) => {
    try {
      const response =
        await createFlight(data).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Flight created",
          message:
            response.message ||
            "Flight created successfully.",
        })
      );

      setShowForm(false);
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          title: "Unable to create flight",
          message: getApiErrorMessage(error),
        })
      );
    }
  };

  const handleUpdate = async (
    data: FlightRequest
  ) => {
    if (!editingFlight) {
      return;
    }

    try {
      const response =
        await updateFlight({
          id: editingFlight.id,
          body: data,
        }).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Flight updated",
          message:
            response.message ||
            "Flight updated successfully.",
        })
      );

      setEditingFlight(null);
      setShowForm(false);
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          title: "Unable to update flight",
          message: getApiErrorMessage(error),
        })
      );
    }
  };

  const handleActivate = async (id: number) => {
    try {
      const response =
        await activateFlight(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Flight activated",
          message:
            response.message ||
            "Flight activated successfully.",
        })
      );
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          title: "Unable to activate flight",
          message: getApiErrorMessage(error),
        })
      );
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      const response =
        await deactivateFlight(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Flight deactivated",
          message:
            response.message ||
            "Flight deactivated successfully.",
        })
      );
    } catch (error) {
      dispatch(
        showAlert({
          type: "error",
          title: "Unable to deactivate flight",
          message: getApiErrorMessage(error),
        })
      );
    }
  };

  const handleEdit = (flight: FlightResponse) => {
    setEditingFlight(flight);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingFlight(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFlight(null);
  };

  const isMutationLoading =
    isCreating ||
    isUpdating ||
    isActivating ||
    isDeactivating;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />

              <span className="text-sm font-semibold text-blue-600">
                Flight Management
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Flights
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create and manage flight schedules,
              routes, aircraft and operational status.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg cursor-pointer bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Create Flight
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Flights
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {flights.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {activeCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Inactive
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {inactiveCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <XCircle className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Showing
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {filteredFlights.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Clock3 className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                All Flights
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your airline schedules.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search flights..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {isLoading || isFetching ? (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm text-slate-500">
                Loading flights...
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <h3 className="text-sm font-semibold text-red-800">
                Unable to load flights
              </h3>

              <p className="mt-1 text-sm text-red-600">
                Please try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <FlightTable
              flights={filteredFlights}
              onEdit={handleEdit}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              isUpdating={isMutationLoading}
            />
          )}
        </section>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <FlightForm
          initialData={
            editingFlight
              ? {
                  id: editingFlight.id,
                  flightNumber:
                    editingFlight.flightNumber,
                  airlineId:
                    editingFlight.airlineId,
                  aircraftId:
                    editingFlight.aircraftId,
                  departureAirportId:
                    editingFlight.departureAirportId,
                  arrivalAirportId:
                    editingFlight.arrivalAirportId,
                  departureTime:
                    editingFlight.departureTime,
                  arrivalTime:
                    editingFlight.arrivalTime,
                  baseFare: editingFlight.baseFare,
                }
              : undefined
          }
          onSubmit={
            editingFlight
              ? handleUpdate
              : handleCreate
          }
          onClose={handleCloseForm}
          isLoading={isMutationLoading}
        />
      )}
    </main>
  );
}

