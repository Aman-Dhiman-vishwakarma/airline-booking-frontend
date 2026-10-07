"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  useCreateBookingMutation,
  type PassengerRequest,
} from "@/store/api/bookingApi";

interface PassengerForm extends PassengerRequest {
  id: number;
}

const createPassenger = (id: number): PassengerForm => ({
  id,
  firstName: "",
  lastName: "",
  gender: "MALE",
  dateOfBirth: "",
});

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const flightIdParam = searchParams.get("flightId");
  const flightId = Number(flightIdParam);

  const [passengers, setPassengers] = useState<PassengerForm[]>([
    createPassenger(1),
  ]);

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [createBooking, { isLoading }] =
    useCreateBookingMutation();

  const isValidFlightId =
    flightIdParam !== null &&
    Number.isInteger(flightId) &&
    flightId > 0;

  const canAddPassenger = passengers.length < 9;

  const updatePassenger = (
    id: number,
    field: keyof PassengerRequest,
    value: string
  ) => {
    setPassengers((currentPassengers) =>
      currentPassengers.map((passenger) =>
        passenger.id === id
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger
      )
    );
  };

  const addPassenger = () => {
    if (!canAddPassenger) {
      return;
    }

    const nextId =
      Math.max(...passengers.map((passenger) => passenger.id)) + 1;

    setPassengers((currentPassengers) => [
      ...currentPassengers,
      createPassenger(nextId),
    ]);
  };

  const removePassenger = (id: number) => {
    if (passengers.length === 1) {
      return;
    }

    setPassengers((currentPassengers) =>
      currentPassengers.filter(
        (passenger) => passenger.id !== id
      )
    );
  };

  const isFormValid = useMemo(() => {
    if (!contactEmail.trim()) {
      return false;
    }

    if (!contactPhone.trim() || !/^[0-9]{10}$/.test(contactPhone)) {
      return false;
    }

    return passengers.every(
      (passenger) =>
        passenger.firstName.trim() &&
        passenger.lastName.trim() &&
        passenger.gender &&
        passenger.dateOfBirth
    );
  }, [contactEmail, contactPhone, passengers]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (!isValidFlightId) {
      setErrorMessage("Invalid flight selected.");
      return;
    }

    if (!isFormValid) {
      setErrorMessage(
        "Please complete all passenger and contact details."
      );
      return;
    }

    try {
      const response = await createBooking({
        flightId,
        passengers: passengers.map(
          ({ id, ...passenger }) => passenger
        ),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
      }).unwrap();

      router.push(
        `/bookings/success?bookingId=${response.data.id}`
      );
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ||
          "Unable to create booking. Please try again."
      );
    }
  };

  if (!isValidFlightId) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-bold text-red-800">
              Invalid flight
            </h1>

            <p className="mt-2 text-sm text-red-700">
              Please select a valid flight before continuing.
            </p>

            <button
              type="button"
              onClick={() => router.push("/flights")}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to Flights
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to flight
          </button>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Secure booking
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Passenger details
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Enter passenger and contact details to confirm your
              booking.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_320px]"
        >
          {/* Main */}
          <div className="space-y-6">

            {/* Passengers */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Passengers
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add details for every passenger.
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {passengers.length}{" "}
                  {passengers.length === 1
                    ? "Passenger"
                    : "Passengers"}
                </span>
              </div>

              <div className="mt-6 space-y-6">
                {passengers.map((passenger, index) => (
                  <div
                    key={passenger.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                          <UserRound className="h-4 w-4 text-slate-600" />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                          Passenger {index + 1}
                        </h3>
                      </div>

                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removePassenger(passenger.id)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* First Name */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          First name
                        </label>

                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(event) =>
                            updatePassenger(
                              passenger.id,
                              "firstName",
                              event.target.value
                            )
                          }
                          placeholder="Enter first name"
                          maxLength={50}
                          className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Last name
                        </label>

                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(event) =>
                            updatePassenger(
                              passenger.id,
                              "lastName",
                              event.target.value
                            )
                          }
                          placeholder="Enter last name"
                          maxLength={50}
                          className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Gender
                        </label>

                        <select
                          value={passenger.gender}
                          onChange={(event) =>
                            updatePassenger(
                              passenger.id,
                              "gender",
                              event.target.value
                            )
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Date of birth
                        </label>

                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          max={
                            new Date()
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(event) =>
                            updatePassenger(
                              passenger.id,
                              "dateOfBirth",
                              event.target.value
                            )
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {canAddPassenger && (
                <button
                  type="button"
                  onClick={addPassenger}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add passenger
                </button>
              )}

              <p className="mt-3 text-xs text-slate-500">
                Maximum 9 passengers per booking.
              </p>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Contact details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                We will use these details for booking
                communication.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(event) =>
                      setContactEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={contactPhone}
                    onChange={(event) =>
                      setContactPhone(
                        event.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="10 digit mobile number"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>
            </section>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm booking
                </>
              )}
            </button>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900">
              Booking summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Selected flight
                </p>

                <p className="mt-2 text-sm font-bold text-slate-900">
                  Flight #{flightId}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Passengers
                  </span>

                  <span className="font-semibold text-slate-900">
                    {passengers.length}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Seat allocation
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  Seats will be automatically assigned
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your seats will be allocated automatically
                  after the booking is confirmed.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}