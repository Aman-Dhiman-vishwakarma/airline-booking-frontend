"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import AircraftForm from "@/components/admin/aircraft/AircraftForm";
import AircraftTable from "@/components/admin/aircraft/AircraftTable";

import {
  useActivateAircraftMutation,
  useCreateAircraftMutation,
  useDeactivateAircraftMutation,
  useGetAircraftQuery,
  useUpdateAircraftMutation,
  type AircraftRequest,
  type AircraftResponse,
} from "@/store/api/aircraftApi";

import {
  useGetAirlinesQuery,
} from "@/store/api/airlineApi";

import { showAlert } from "@/store/slices/uiSlice";

export default function AircraftPage() {
  const dispatch = useDispatch();

  const {
    data: aircraftResponse,
    isLoading: aircraftLoading,
    isError: aircraftError,
    refetch,
  } = useGetAircraftQuery();

  const {
    data: airlineResponse,
    isLoading: airlinesLoading,
  } = useGetAirlinesQuery();

  const [createAircraft, { isLoading: isCreating }] =
    useCreateAircraftMutation();

  const [updateAircraft, { isLoading: isUpdating }] =
    useUpdateAircraftMutation();

  const [activateAircraft] =
    useActivateAircraftMutation();

  const [deactivateAircraft] =
    useDeactivateAircraftMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAircraft, setSelectedAircraft] =
    useState<AircraftResponse | null>(null);

  const [search, setSearch] = useState("");

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const aircraft = aircraftResponse?.data ?? [];
  const airlines = airlineResponse?.data ?? [];

  const filteredAircraft = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return aircraft;
    }

    return aircraft.filter((item) => {
      return (
        item.model.toLowerCase().includes(query) ||
        item.registrationNumber.toLowerCase().includes(query) ||
        item.airlineName.toLowerCase().includes(query)
      );
    });
  }, [aircraft, search]);

  const totalAircraft = aircraft.length;

  const activeAircraft = aircraft.filter(
    (item) => item.active
  ).length;

  const inactiveAircraft =
    totalAircraft - activeAircraft;

  const openCreateModal = () => {
    setSelectedAircraft(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AircraftResponse) => {
    setSelectedAircraft(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedAircraft(null);
  };

  const handleSubmit = async (data: AircraftRequest) => {
    try {
      if (selectedAircraft) {
        await updateAircraft({
          id: selectedAircraft.id,
          body: data,
        }).unwrap();

        dispatch(
          showAlert({
            type: "success",
            title: "Aircraft updated",
            message: "Aircraft details updated successfully.",
          })
        );
      } else {
        await createAircraft(data).unwrap();

        dispatch(
          showAlert({
            type: "success",
            title: "Aircraft created",
            message: "Aircraft created successfully.",
          })
        );
      }

      closeModal();
    } catch (error: any) {
      dispatch(
        showAlert({
          type: "error",
          title: selectedAircraft
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

      await activateAircraft(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Aircraft activated",
          message: "Aircraft has been activated successfully.",
        })
      );
    } catch (error: any) {
      dispatch(
        showAlert({
          type: "error",
          title: "Activation failed",
          message:
            error?.data?.message ??
            "Unable to activate aircraft.",
        })
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      setProcessingId(id);

      await deactivateAircraft(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Aircraft deactivated",
          message: "Aircraft has been deactivated successfully.",
        })
      );
    } catch (error: any) {
      dispatch(
        showAlert({
          type: "error",
          title: "Deactivation failed",
          message:
            error?.data?.message ??
            "Unable to deactivate aircraft.",
        })
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <span>Admin</span>

            <ChevronLeft className="h-4 w-4 rotate-180" />

            <span className="font-medium text-slate-700">
              Aircraft
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Aircraft Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage airline aircraft, registration numbers,
                models and seat capacity.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              disabled={airlinesLoading || airlines.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Aircraft
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Aircraft
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {totalAircraft}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-5">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {activeAircraft}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Inactive
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-600">
              {inactiveAircraft}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search model, registration or airline..."
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
              {filteredAircraft.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalAircraft}
            </span>{" "}
            aircraft
          </p>
        </div>

        {/* Error */}
        {aircraftError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  Unable to load aircraft
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  Something went wrong while fetching aircraft.
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
          <AircraftTable
            aircraft={filteredAircraft}
            isLoading={aircraftLoading}
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
                  {selectedAircraft
                    ? "Edit Aircraft"
                    : "Add Aircraft"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedAircraft
                    ? "Update aircraft information."
                    : "Add a new aircraft to an airline fleet."}
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
              {airlines.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />

                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        No active airline available
                      </p>

                      <p className="mt-1 text-sm text-amber-700">
                        Create an active airline before adding
                        an aircraft.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <AircraftForm
                  airlines={airlines}
                  aircraft={selectedAircraft}
                  isSubmitting={isCreating || isUpdating}
                  onSubmit={handleSubmit}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}