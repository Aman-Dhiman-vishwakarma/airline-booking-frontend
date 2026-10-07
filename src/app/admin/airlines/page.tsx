"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";

import {
  useActivateAirlineMutation,
  useCreateAirlineMutation,
  useDeactivateAirlineMutation,
  useGetAirlinesQuery,
  useUpdateAirlineMutation,
  type AirlineRequest,
  type AirlineResponse,
} from "@/store/api/airlineApi";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { showAlert } from "@/store/slices/uiSlice";

import AirlineForm from "@/components/admin/airlines/AirlineForm";
import AirlineTable from "@/components/admin/airlines/AirlineTable";

export default function AdminAirlinesPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAirlinesQuery();

  const [createAirline, { isLoading: isCreating }] =
    useCreateAirlineMutation();

  const [updateAirline, { isLoading: isUpdating }] =
    useUpdateAirlineMutation();

  const [activateAirline] =
    useActivateAirlineMutation();

  const [deactivateAirline] =
    useDeactivateAirlineMutation();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedAirline, setSelectedAirline] =
    useState<AirlineResponse | null>(null);

  const [search, setSearch] = useState("");

  const [actionLoadingId, setActionLoadingId] =
    useState<number | null>(null);

  const airlines = data?.data ?? [];

  const filteredAirlines = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return airlines;
    }

    return airlines.filter((airline) => {
      return (
        airline.name
          .toLowerCase()
          .includes(query) ||
        airline.code
          .toLowerCase()
          .includes(query)
      );
    });
  }, [airlines, search]);

  const openCreateModal = () => {
    setSelectedAirline(null);
    setIsModalOpen(true);
  };

  const openEditModal = (
    airline: AirlineResponse
  ) => {
    setSelectedAirline(airline);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedAirline(null);
  };

  const handleSubmit = async (
    formData: AirlineRequest
  ) => {
    try {
      if (selectedAirline) {
        const response =
          await updateAirline({
            id: selectedAirline.id,
            body: formData,
          }).unwrap();

        dispatch(
          showAlert({
            type: "success",
            title: "Airline updated",
            message:
              response.message ||
              "Airline updated successfully.",
          })
        );
      } else {
        const response =
          await createAirline(formData).unwrap();

        dispatch(
          showAlert({
            type: "success",
            title: "Airline created",
            message:
              response.message ||
              "Airline created successfully.",
          })
        );
      }

      closeModal();
    } catch (error) {
      const apiError = error as {
        data?: {
          message?: string;
        };
      };

      dispatch(
        showAlert({
          type: "error",
          title: selectedAirline
            ? "Unable to update airline"
            : "Unable to create airline",
          message:
            apiError.data?.message ??
            "Something went wrong. Please try again.",
        })
      );
    }
  };

  const handleActivate = async (
    id: number
  ) => {
    try {
      setActionLoadingId(id);

      const response =
        await activateAirline(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Airline activated",
          message:
            response.message ||
            "Airline activated successfully.",
        })
      );
    } catch (error) {
      const apiError = error as {
        data?: {
          message?: string;
        };
      };

      dispatch(
        showAlert({
          type: "error",
          title: "Unable to activate airline",
          message:
            apiError.data?.message ??
            "Something went wrong. Please try again.",
        })
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeactivate = async (
    id: number
  ) => {
    try {
      setActionLoadingId(id);

      const response =
        await deactivateAirline(id).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Airline deactivated",
          message:
            response.message ||
            "Airline deactivated successfully.",
        })
      );
    } catch (error) {
      const apiError = error as {
        data?: {
          message?: string;
        };
      };

      dispatch(
        showAlert({
          type: "error",
          title: "Unable to deactivate airline",
          message:
            apiError.data?.message ??
            "Something went wrong. Please try again.",
        })
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950">
                <Building2 className="h-4 w-4 text-white" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Administration
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Airlines
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage airlines available in your booking platform.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add airline
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total airlines
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {airlines.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {
                airlines.filter(
                  (airline) => airline.active
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Inactive
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-600">
              {
                airlines.filter(
                  (airline) => !airline.active
                ).length
              }
            </p>
          </div>
        </div>

        {/* Main Card */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Airline directory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredAirlines.length}{" "}
                {filteredAirlines.length === 1
                  ? "airline"
                  : "airlines"}{" "}
                shown
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search airline or code..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {isError ? (
            <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                Unable to load airlines
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                We couldn't fetch airline data from the server.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Loader2 className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          ) : (
            <AirlineTable
              airlines={filteredAirlines}
              isLoading={isLoading}
              actionLoadingId={actionLoadingId}
              onEdit={openEditModal}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          )}
        </section>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {selectedAirline
                    ? "Edit airline"
                    : "Add airline"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedAirline
                    ? "Update the airline information below."
                    : "Add a new airline to your platform."}
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
              <AirlineForm
                airline={selectedAirline}
                isLoading={
                  isCreating || isUpdating
                }
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