"use client";

import {
  AlertCircle,
  Loader2,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import AirportForm from "@/components/admin/airports/AirportForm";
import AirportTable from "@/components/admin/airports/AirportTable";

import {
  useActivateAirportMutation,
  useCreateAirportMutation,
  useDeactivateAirportMutation,
  useGetAirportsQuery,
  useUpdateAirportMutation,
  type AirportRequest,
  type AirportResponse,
} from "@/store/api/airportApi";

import { showAlert } from "@/store/slices/uiSlice";

export default function AirportsPage() {
  const dispatch = useDispatch();

  const {
    data: airportResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAirportsQuery();

  const [createAirport, { isLoading: isCreating }] =
    useCreateAirportMutation();

  const [updateAirport, { isLoading: isUpdating }] =
    useUpdateAirportMutation();

  const [activateAirport] =
    useActivateAirportMutation();

  const [deactivateAirport] =
    useDeactivateAirportMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAirport, setSelectedAirport] =
    useState<AirportResponse | null>(null);

  const [search, setSearch] = useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const airports = airportResponse?.data ?? [];

  const filteredAirports = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return airports;
    }

    return airports.filter((airport) => {
      return (
        airport.name.toLowerCase().includes(query) ||
        airport.code.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
      );
    });
  }, [airports, search]);

  const totalAirports = airports.length;

  const activeAirports = airports.filter(
    (airport) => airport.active
  ).length;

  const inactiveAirports =
    totalAirports - activeAirports;

  const openCreateModal = () => {
    setSelectedAirport(null);
    setIsModalOpen(true);
  };

  const openEditModal = (airport: AirportResponse) => {
    setSelectedAirport(airport);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedAirport(null);
  };

  const handleSubmit = async (data: AirportRequest) => {
    try {
      if (selectedAirport) {
        await updateAirport({
          id: selectedAirport.id,
          body: data,
        }).unwrap();

        dispatch(
          showAlert({
            type: "success",
            title: "Airport updated",
            message:
              "Airport details updated successfully.",
          })
        );
      } else {
        await createAirport(data).unwrap();

        dispatch(
          showAlert({
            type: "success",
            title: "Airport created",
            message: "Airport created successfully.",
          })
        );
      }

      closeModal();
    } catch (error: any) {
      dispatch(
        showAlert({
          type: "error",
          title: selectedAirport
            ? "Update failed"
            : "Creation failed",
          message:
            error?.data?.message ??
            "Something went wrong. Please try again.",
        })
      );
    }
  };

  const handleActivate = async (id: number) => {
    try {
      setProcessingId(id);

      await activateAirport(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Airport activated",
          message:
            "Airport has been activated successfully.",
        })
      );
    } catch (error: any) {
      dispatch(
        showAlert({
          type: "error",
          title: "Activation failed",
          message:
            error?.data?.message ??
            "Unable to activate airport.",
        })
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      setProcessingId(id);

      await deactivateAirport(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Airport deactivated",
          message:
            "Airport has been deactivated successfully.",
        })
      );
    } catch (error: any) {
      dispatch(
        showAlert({
          type: "error",
          title: "Deactivation failed",
          message:
            error?.data?.message ??
            "Unable to deactivate airport.",
        })
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <span>Admin</span>

            <span>/</span>

            <span className="font-medium text-slate-700">
              Airports
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Airport Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage airports, IATA codes, cities and
                countries used throughout the booking system.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Airport
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Airports
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {totalAirports}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-5">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {activeAirports}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Inactive
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-600">
              {inactiveAirports}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search airport, code, city or country..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredAirports.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalAirports}
            </span>{" "}
            airports
          </p>
        </div>

        {/* Error */}
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  Unable to load airports
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  Something went wrong while fetching airport
                  data.
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  <Loader2 className="h-3.5 w-3.5" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AirportTable
            airports={filteredAirports}
            isLoading={isLoading}
            processingId={processingId}
            onEdit={openEditModal}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {selectedAirport
                    ? "Edit Airport"
                    : "Add Airport"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedAirport
                    ? "Update airport information."
                    : "Add a new airport to the system."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isCreating || isUpdating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <AirportForm
                airport={selectedAirport}
                isSubmitting={isCreating || isUpdating}
                onSubmit={handleSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}