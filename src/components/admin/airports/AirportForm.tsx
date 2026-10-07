"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  AirportRequest,
  AirportResponse,
} from "@/store/api/airportApi";

const airportSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Airport name is required")
    .max(100, "Airport name must not exceed 100 characters"),

  code: z
    .string()
    .trim()
    .length(3, "Airport code must be exactly 3 characters"),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must not exceed 100 characters"),

  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country must not exceed 100 characters"),
});

type AirportFormValues = z.infer<typeof airportSchema>;

interface AirportFormProps {
  airport?: AirportResponse | null;
  isSubmitting: boolean;
  onSubmit: (data: AirportRequest) => void;
  onCancel: () => void;
}

export default function AirportForm({
  airport,
  isSubmitting,
  onSubmit,
  onCancel,
}: AirportFormProps) {
  const isEditMode = Boolean(airport);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AirportFormValues>({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      name: airport?.name ?? "",
      code: airport?.code ?? "",
      city: airport?.city ?? "",
      country: airport?.country ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: airport?.name ?? "",
      code: airport?.code ?? "",
      city: airport?.city ?? "",
      country: airport?.country ?? "",
    });
  }, [airport, reset]);

  const submitForm = (data: AirportFormValues) => {
    onSubmit({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      city: data.city.trim(),
      country: data.country.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {/* Airport Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Airport Name
        </label>

        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="name"
            type="text"
            placeholder="e.g. Indira Gandhi International Airport"
            autoComplete="off"
            {...register("name")}
            className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />
        </div>

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Airport Code */}
      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Airport Code
        </label>

        <input
          id="code"
          type="text"
          maxLength={3}
          placeholder="e.g. DEL"
          autoComplete="off"
          {...register("code")}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm uppercase tracking-widest text-slate-900 outline-none transition ${
            errors.code
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        <p className="mt-1.5 text-xs text-slate-400">
          IATA-style 3-letter airport code.
        </p>

        {errors.code && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.code.message}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          City
        </label>

        <input
          id="city"
          type="text"
          placeholder="e.g. New Delhi"
          autoComplete="address-level2"
          {...register("city")}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition ${
            errors.city
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.city && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.city.message}
          </p>
        )}
      </div>

      {/* Country */}
      <div>
        <label
          htmlFor="country"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Country
        </label>

        <input
          id="country"
          type="text"
          placeholder="e.g. India"
          autoComplete="country-name"
          {...register("country")}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition ${
            errors.country
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.country && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.country.message}
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
              ? "Update Airport"
              : "Create Airport"}
        </button>
      </div>
    </form>
  );
}