"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  X,
} from "lucide-react";

import type {
  AirlineRequest,
  AirlineResponse,
} from "@/store/api/airlineApi";

const airlineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Airline name is required")
    .max(100, "Airline name must not exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(1, "Airline code is required")
    .max(10, "Airline code must not exceed 10 characters")
    .transform((value) => value.toUpperCase()),
});

type AirlineFormData = z.infer<typeof airlineSchema>;

interface AirlineFormProps {
  airline?: AirlineResponse | null;
  isLoading: boolean;
  onSubmit: (data: AirlineRequest) => void;
  onCancel: () => void;
}

export default function AirlineForm({
  airline,
  isLoading,
  onSubmit,
  onCancel,
}: AirlineFormProps) {
  const isEditMode = Boolean(airline);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AirlineFormData>({
    resolver: zodResolver(airlineSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    if (airline) {
      reset({
        name: airline.name,
        code: airline.code,
      });
    } else {
      reset({
        name: "",
        code: "",
      });
    }
  }, [airline, reset]);

  const submitHandler = (data: AirlineFormData) => {
    onSubmit({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      noValidate
      className="space-y-5"
    >
      {/* Airline Name */}
      <div>
        <label
          htmlFor="airline-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Airline name
        </label>

        <input
          id="airline-name"
          type="text"
          placeholder="e.g. Air India"
          autoComplete="off"
          {...register("name")}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
            errors.name
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.name.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Maximum 100 characters.
        </p>
      </div>

      {/* Airline Code */}
      <div>
        <label
          htmlFor="airline-code"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Airline code
        </label>

        <input
          id="airline-code"
          type="text"
          placeholder="e.g. AI"
          autoComplete="off"
          maxLength={10}
          {...register("code")}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:text-slate-400 ${
            errors.code
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {errors.code && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.code.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Maximum 10 characters. Code will be saved in uppercase.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? "Update airline" : "Create airline"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}