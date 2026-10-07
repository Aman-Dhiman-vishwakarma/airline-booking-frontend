"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";

import type { FlightRequest } from "@/store/api/flightApi";

import {
  useGetAirlinesQuery,
  type AirlineResponse,
} from "@/store/api/airlineApi";

import {
  useGetAircraftQuery,
  type AircraftResponse,
} from "@/store/api/aircraftApi";

import {
  useGetAirportsQuery,
  type AirportResponse,
} from "@/store/api/airportApi";

const flightSchema = z
  .object({
    flightNumber: z
      .string()
      .trim()
      .min(1, "Flight number is required")
      .max(
        20,
        "Flight number must not exceed 20 characters"
      ),

    airlineId: z
      .string()
      .min(1, "Airline is required"),

    aircraftId: z
      .string()
      .min(1, "Aircraft is required"),

    departureAirportId: z
      .string()
      .min(1, "Departure airport is required"),

    arrivalAirportId: z
      .string()
      .min(1, "Arrival airport is required"),

    departureTime: z
      .string()
      .min(1, "Departure time is required"),

    arrivalTime: z
      .string()
      .min(1, "Arrival time is required"),

    baseFare: z
      .string()
      .min(1, "Base fare is required")
      .refine(
        (value) => Number(value) > 0,
        "Base fare must be greater than 0"
      ),
  })
  .refine(
    (data) =>
      data.departureAirportId !==
      data.arrivalAirportId,
    {
      message:
        "Departure and arrival airports must be different",
      path: ["arrivalAirportId"],
    }
  )
  .refine(
    (data) =>
      new Date(data.arrivalTime) >
      new Date(data.departureTime),
    {
      message:
        "Arrival time must be after departure time",
      path: ["arrivalTime"],
    }
  );

type FlightFormData = z.infer<typeof flightSchema>;

interface FlightFormProps {
  initialData?: {
    id: number;
    flightNumber: string;
    airlineId: number;
    aircraftId: number;
    departureAirportId: number;
    arrivalAirportId: number;
    departureTime: string;
    arrivalTime: string;
    baseFare: number;
  };

  onSubmit: (data: FlightRequest) => Promise<void>;

  onClose: () => void;

  isLoading?: boolean;
}

function formatDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() -
      offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function FlightForm({
  initialData,
  onSubmit,
  onClose,
  isLoading = false,
}: FlightFormProps) {
  const {
    data: airlinesResponse,
    isLoading: airlinesLoading,
  } = useGetAirlinesQuery();

  const {
    data: aircraftResponse,
    isLoading: aircraftLoading,
  } = useGetAircraftQuery();

  const {
    data: airportsResponse,
    isLoading: airportsLoading,
  } = useGetAirportsQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),

    defaultValues: {
      flightNumber: "",
      airlineId: "",
      aircraftId: "",
      departureAirportId: "",
      arrivalAirportId: "",
      departureTime: "",
      arrivalTime: "",
      baseFare: "",
    },
  });

  useEffect(() => {
    if (!initialData) {
      reset({
        flightNumber: "",
        airlineId: "",
        aircraftId: "",
        departureAirportId: "",
        arrivalAirportId: "",
        departureTime: "",
        arrivalTime: "",
        baseFare: "",
      });

      return;
    }

    reset({
      flightNumber: initialData.flightNumber,

      airlineId: String(
        initialData.airlineId
      ),

      aircraftId: String(
        initialData.aircraftId
      ),

      departureAirportId: String(
        initialData.departureAirportId
      ),

      arrivalAirportId: String(
        initialData.arrivalAirportId
      ),

      departureTime: formatDateTimeLocal(
        initialData.departureTime
      ),

      arrivalTime: formatDateTimeLocal(
        initialData.arrivalTime
      ),

      baseFare: String(
        initialData.baseFare
      ),
    });
  }, [initialData, reset]);

  const airlines =
    airlinesResponse?.data ?? [];

  const aircraft =
    aircraftResponse?.data ?? [];

  const airports =
    airportsResponse?.data ?? [];

  const activeAirlines =
    airlines.filter(
      (airline: AirlineResponse) =>
        airline.active
    );

  const activeAircraft =
    aircraft.filter(
      (item: AircraftResponse) =>
        item.active
    );

  const activeAirports =
    airports.filter(
      (airport: AirportResponse) =>
        airport.active
    );

  const submitHandler = async (
    data: FlightFormData
  ) => {
    await onSubmit({
      flightNumber:
        data.flightNumber
          .trim()
          .toUpperCase(),

      airlineId: Number(
        data.airlineId
      ),

      aircraftId: Number(
        data.aircraftId
      ),

      departureAirportId: Number(
        data.departureAirportId
      ),

      arrivalAirportId: Number(
        data.arrivalAirportId
      ),

      departureTime: new Date(
        data.departureTime
      ).toISOString(),

      arrivalTime: new Date(
        data.arrivalTime
      ).toISOString(),

      baseFare: Number(
        data.baseFare
      ),
    });
  };

  const selectClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initialData
                ? "Edit Flight"
                : "Create Flight"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure flight route,
              schedule and base fare.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(
            submitHandler
          )}
          className="overflow-y-auto"
        >
          <div className="grid gap-5 p-6 md:grid-cols-2">

            {/* Flight Number */}
            <div className="md:col-span-2">
              <label
                htmlFor="flightNumber"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Flight Number
              </label>

              <input
                id="flightNumber"
                placeholder="e.g. 6E-203"
                {...register("flightNumber")}
                className={inputClass}
              />

              {errors.flightNumber && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors.flightNumber
                      .message
                  }
                </p>
              )}
            </div>

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
                {...register("airlineId")}
                className={selectClass}
                disabled={airlinesLoading}
              >
                <option value="">
                  {airlinesLoading
                    ? "Loading airlines..."
                    : "Select airline"}
                </option>

                {activeAirlines.map(
                  (airline) => (
                    <option
                      key={airline.id}
                      value={airline.id}
                    >
                      {airline.name} (
                      {airline.code})
                    </option>
                  )
                )}
              </select>

              {errors.airlineId && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors.airlineId
                      .message
                  }
                </p>
              )}
            </div>

            {/* Aircraft */}
            <div>
              <label
                htmlFor="aircraftId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Aircraft
              </label>

              <select
                id="aircraftId"
                {...register("aircraftId")}
                className={selectClass}
                disabled={aircraftLoading}
              >
                <option value="">
                  {aircraftLoading
                    ? "Loading aircraft..."
                    : "Select aircraft"}
                </option>

                {activeAircraft.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {
                        item.registrationNumber
                      }{" "}
                      — {item.model}
                    </option>
                  )
                )}
              </select>

              {errors.aircraftId && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors.aircraftId
                      .message
                  }
                </p>
              )}
            </div>

            {/* Departure Airport */}
            <div>
              <label
                htmlFor="departureAirportId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Departure Airport
              </label>

              <select
                id="departureAirportId"
                {...register(
                  "departureAirportId"
                )}
                className={selectClass}
                disabled={airportsLoading}
              >
                <option value="">
                  {airportsLoading
                    ? "Loading airports..."
                    : "Select departure airport"}
                </option>

                {activeAirports.map(
                  (airport) => (
                    <option
                      key={airport.id}
                      value={airport.id}
                    >
                      {airport.code} —{" "}
                      {airport.city}
                    </option>
                  )
                )}
              </select>

              {errors.departureAirportId && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors
                      .departureAirportId
                      .message
                  }
                </p>
              )}
            </div>

            {/* Arrival Airport */}
            <div>
              <label
                htmlFor="arrivalAirportId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Arrival Airport
              </label>

              <select
                id="arrivalAirportId"
                {...register(
                  "arrivalAirportId"
                )}
                className={selectClass}
                disabled={airportsLoading}
              >
                <option value="">
                  {airportsLoading
                    ? "Loading airports..."
                    : "Select arrival airport"}
                </option>

                {activeAirports.map(
                  (airport) => (
                    <option
                      key={airport.id}
                      value={airport.id}
                    >
                      {airport.code} —{" "}
                      {airport.city}
                    </option>
                  )
                )}
              </select>

              {errors.arrivalAirportId && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors
                      .arrivalAirportId
                      .message
                  }
                </p>
              )}
            </div>

            {/* Departure Time */}
            <div>
              <label
                htmlFor="departureTime"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Departure Time
              </label>

              <input
                id="departureTime"
                type="datetime-local"
                {...register(
                  "departureTime"
                )}
                className={inputClass}
              />

              {errors.departureTime && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors.departureTime
                      .message
                  }
                </p>
              )}
            </div>

            {/* Arrival Time */}
            <div>
              <label
                htmlFor="arrivalTime"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Arrival Time
              </label>

              <input
                id="arrivalTime"
                type="datetime-local"
                {...register(
                  "arrivalTime"
                )}
                className={inputClass}
              />

              {errors.arrivalTime && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors.arrivalTime
                      .message
                  }
                </p>
              )}
            </div>

            {/* Base Fare */}
            <div className="md:col-span-2">
              <label
                htmlFor="baseFare"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Base Fare
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                  ₹
                </span>

                <input
                  id="baseFare"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="e.g. 4999"
                  {...register("baseFare")}
                  className={`${inputClass} pl-8`}
                />
              </div>

              {errors.baseFare && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {
                    errors.baseFare
                      .message
                  }
                </p>
              )}

              <p className="mt-1.5 text-xs text-slate-500">
                Base fare is the starting
                ticket price before any
                additional charges.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {initialData
                ? "Update Flight"
                : "Create Flight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}