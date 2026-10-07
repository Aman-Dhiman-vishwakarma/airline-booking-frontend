"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Plane,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import {
  useLoginMutation,
  type LoginRequest,
} from "@/store/api/authApi";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

import { setCredentials } from "@/store/slices/authSlice";
import { showAlert } from "@/store/slices/uiSlice";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [loginUser, { isLoading }] =
    useLoginMutation();

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    setServerError(null);

    const payload: LoginRequest = {
      email: data.email.trim(),
      password: data.password,
    };

    try {
      const response =
        await loginUser(payload).unwrap();

      // JWT browser cookie me hai.
      // Redux me sirf user information rakhenge.
      dispatch(
        setCredentials(response.data)
      );

      dispatch(
        showAlert({
          type: "success",
          title: "Login successful",
          message: `Welcome back, ${response.data.firstName}!`,
        })
      );

      router.push("/");
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
        "Unable to login. Please check your credentials and try again.";

      setServerError(message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-7xl">

        {/* LEFT BRANDING SECTION */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                <Plane className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-lg font-semibold text-white">
                  Airline Booking
                </p>

                <p className="text-xs text-slate-400">
                  Travel smarter
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-xl">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-400/20">
                <ShieldCheck className="h-7 w-7 text-blue-400" />
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Your journey starts
                <span className="block text-blue-400">
                  with a secure login.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Manage your flights, bookings and
                travel details from one secure place.
              </p>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-500">
              Secure airline booking platform
            </p>
          </div>
        </section>

        {/* RIGHT LOGIN SECTION */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-10 items-center justify-center rounded-xl bg-slate-950">
                <Plane className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-lg font-semibold text-slate-900">
                  Airline Booking
                </p>

                <p className="text-xs text-slate-500">
                  Travel smarter
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your account.
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {serverError}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email", { onChange: () => { if (serverError) { setServerError(null); } }, })}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password", { onChange: () => { if (serverError) { setServerError(null); } }, })}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 cursor-pointer rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-slate-950 transition hover:text-blue-600"
              >
                Create account
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}