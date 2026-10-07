"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  ShieldCheck,
  User,
  UserRound,
  XCircle,
} from "lucide-react";

import { useGetMeQuery } from "@/store/api/authApi";

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = useGetMeQuery();

  const user = data?.data;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Unable to load profile
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              We could not fetch your profile information. Please try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <section className="mt-6">
          <p className="text-sm font-medium text-slate-500">
            Account settings
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            View your account information and profile details.
          </p>
        </section>

        {/* Profile Hero */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                <UserRound className="h-9 w-9" />
              </div>

              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  {user.email}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <User className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500">
                  Your registered account details
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <ProfileField
                icon={<User className="h-4 w-4" />}
                label="First Name"
                value={user.firstName}
              />

              <ProfileField
                icon={<User className="h-4 w-4" />}
                label="Last Name"
                value={user.lastName}
              />

              <ProfileField
                icon={<Mail className="h-4 w-4" />}
                label="Email Address"
                value={user.email}
              />

              <ProfileField
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Account Role"
                value={user.role}
              />
            </div>
          </div>
        </section>

        {/* Account Status */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <ShieldCheck className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Account Status
              </h2>

              <p className="text-sm text-slate-500">
                Current account security and verification status
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatusCard
              label="Account"
              value={user.enabled ? "Active" : "Disabled"}
              active={user.enabled}
            />

            <StatusCard
              label="Email Verification"
              value={
                user.emailVerified ? "Verified" : "Not verified"
              }
              active={user.emailVerified}
            />
          </div>
        </section>

        {/* Future Settings */}
        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <CalendarDays className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Profile Updates
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Profile editing will be available once the backend update
                API is added.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileField({
  icon,
  label,
  value,
}: ProfileFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-950">
        {value || "Not available"}
      </p>
    </div>
  );
}

interface StatusCardProps {
  label: string;
  value: string;
  active: boolean;
}

function StatusCard({
  label,
  value,
  active,
}: StatusCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 text-sm font-semibold ${
            active ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {value}
        </p>
      </div>

      {active ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="h-5 w-32 rounded bg-slate-200" />

        <div className="mt-6 space-y-3">
          <div className="h-9 w-48 rounded bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-200" />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white">
          <div className="h-36 bg-slate-200" />

          <div className="p-8">
            <div className="h-6 w-48 rounded bg-slate-200" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 h-40 rounded-2xl bg-white" />
      </div>
    </main>
  );
}