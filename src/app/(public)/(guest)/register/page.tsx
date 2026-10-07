"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Plane,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { showAlert } from "@/store/slices/uiSlice";
import type { AppDispatch } from "@/store/store";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name must not exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must not exceed 50 characters"),

    email: z.string().trim().email("Please enter a valid email address"),

    password: z.string().min(8, "Password must contain at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const dispatch = useDispatch<AppDispatch>();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    try {
      const response = await registerUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      dispatch(
        showAlert({
          type: "success",
          title: "Account created",
          message: response.message,
        }),
      );
    } catch (error) {
      const apiError = error as {
        status?: number;
        data?: {
          success?: boolean;
          message?: string;
        };
      };

      const message =
        apiError.data?.message ??
        "Unable to create your account. Please try again.";

      setServerError(message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Left branding section */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_45%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Plane className="h-5 w-5 -rotate-45 text-slate-950" />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  Airline Booking
                </p>

                <p className="text-xs text-slate-400">Fly smarter</p>
              </div>
            </Link>

            {/* Main content */}
            <div className="max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-blue-400" />

                <span className="text-sm text-slate-300">
                  Secure & seamless travel
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Your journey
                <br />
                starts here.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Create your account and discover a simpler way to search
                flights, manage bookings and plan your next journey.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <Feature value="Easy" label="Booking" />

                <Feature value="Fast" label="Search" />

                <Feature value="Secure" label="Account" />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              © 2026 Airline Booking. All rights reserved.
            </p>
          </div>
        </section>

        {/* Form section */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950">
                <Plane className="h-5 w-5 -rotate-45 text-white" />
              </div>

              <div>
                <p className="font-bold text-slate-950">Airline Booking</p>

                <p className="text-xs text-slate-500">Fly smarter</p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-blue-600">
                Get started
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your details to get started with Airline Booking.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-semibold text-red-700">
                  Registration failed
                </p>

                <p className="mt-1 text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* First + Last name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="First name"
                  icon={<User className="h-4 w-4" />}
                  error={errors.firstName?.message}
                >
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="Aman"
                    className={inputClass(!!errors.firstName)}
                  />
                </FormField>

                <FormField label="Last name" error={errors.lastName?.message}>
                  <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Dhiman"
                    className={inputClass(!!errors.lastName)}
                  />
                </FormField>
              </div>

              {/* Email */}
              <FormField
                label="Email address"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
              >
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass(!!errors.email)}
                />
              </FormField>

              {/* Password */}
              <FormField
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
              >
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={`${inputClass(!!errors.password)} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Confirm password */}
              <FormField
                label="Confirm password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={`${inputClass(!!errors.confirmPassword)} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm cursor-pointer font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-950 transition hover:text-blue-600"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to our terms and privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function Feature({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function FormField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}

        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `
    w-full
    rounded-xl
    border
    px-4
    py-3
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    ${
      hasError
        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : "border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
    }
  `;
}
