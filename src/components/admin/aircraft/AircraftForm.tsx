"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plane } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  AircraftRequest,
  AircraftResponse,
} from "@/store/api/aircraftApi";
import type { AirlineResponse } from "@/store/api/airlineApi";

const aircraftSchema = z.object({
  airlineId: z
    .number()
    .int()
    .positive("Please select an airline"),

  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(20, "Registration number must not exceed 20 characters"),

  model: z
    .string()
    .trim()
    .min(1, "Aircraft model is required")
    .max(50, "Aircraft model must not exceed 50 characters"),

  totalSeats: z
    .number()
    .int("Total seats must be a whole number")
    .min(1, "Total seats must be at least 1"),
});

type AircraftFormValues = z.infer<typeof aircraftSchema>;

interface AircraftFormProps {
  airlines: AirlineResponse[];
  aircraft?: AircraftResponse | null;
  isSubmitting: boolean;
  onSubmit: (data: AircraftRequest) => void;
  onCancel: () => void;
}

export default function AircraftForm({
  airlines,
  aircraft,
  isSubmitting,
  onSubmit,
  onCancel,
}: AircraftFormProps) {
  const isEditMode = Boolean(aircraft);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: {
      airlineId: aircraft?.airlineId ?? 0,
      registrationNumber: aircraft?.registrationNumber ?? "",
      model: aircraft?.model ?? "",
      totalSeats: aircraft?.totalSeats ?? 0,
    },
  });

  useEffect(() => {
    reset({
      airlineId: aircraft?.airlineId ?? 0,
      registrationNumber: aircraft?.registrationNumber ?? "",
      model: aircraft?.model ?? "",
      totalSeats: aircraft?.totalSeats ?? 0,
    });
  }, [aircraft, reset]);

  const submitForm = (data: AircraftFormValues) => {
    onSubmit({
      airlineId: data.airlineId,
      registrationNumber: data.registrationNumber
        .trim()
        .toUpperCase(),
      model: data.model.trim(),
      totalSeats: data.totalSeats,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {/* Airline */}
      <div>
        <label
          htmlFor="airlineId"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Airline
        </label>

        <select
          id="airlineId"
          {...register("airlineId", { valueAsNumber: true })}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition ${
            errors.airlineId
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        >
          <option value={0}>Select airline</option>

          {airlines.map((airline) => (
            <option
              key={airline.id}
              value={airline.id}
              disabled={!airline.active}
            >
              {airline.name} ({airline.code})
              {!airline.active ? " - Inactive" : ""}
            </option>
          ))}
        </select>

        {errors.airlineId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.airlineId.message}
          </p>
        )}
      </div>

      {/* Registration Number */}
      <div>
        <label
          htmlFor="registrationNumber"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Registration Number
        </label>

        <input
          id="registrationNumber"
          type="text"
          placeholder="e.g. VT-IGF"
          autoComplete="off"
          {...register("registrationNumber")}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 uppercase outline-none transition placeholder:normal-case placeholder:text-slate-400 ${
            errors.registrationNumber
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.registrationNumber && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.registrationNumber.message}
          </p>
        )}
      </div>

      {/* Model */}
      <div>
        <label
          htmlFor="model"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Aircraft Model
        </label>

        <div className="relative">
          <Plane className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="model"
            type="text"
            placeholder="e.g. Airbus A320"
            autoComplete="off"
            {...register("model")}
            className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition ${
              errors.model
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />
        </div>

        {errors.model && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.model.message}
          </p>
        )}
      </div>

      {/* Total Seats */}
      <div>
        <label
          htmlFor="totalSeats"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Total Seats
        </label>

        <input
          id="totalSeats"
          type="number"
          min={1}
          placeholder="e.g. 180"
          {...register("totalSeats", { valueAsNumber: true })}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition ${
            errors.totalSeats
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.totalSeats && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.totalSeats.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Aircraft"
              : "Create Aircraft"}
        </button>
      </div>
    </form>
  );
}