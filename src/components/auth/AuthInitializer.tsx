"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Plane } from "lucide-react";

import { useGetMeQuery } from "@/store/api/authApi";
import {
  clearCredentials,
  setAuthInitialized,
  setCredentials,
} from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  const {
    data,
    isSuccess,
    isError,
  } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess) {
      if (data?.data) {
        dispatch(setCredentials(data.data));
      }

      dispatch(setAuthInitialized());
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearCredentials());
      dispatch(setAuthInitialized());
    }
  }, [isError, dispatch]);

  const isInitialized = isSuccess || isError;

  if (isInitialized) {
    return null;
  }

  return <AuthLoadingScreen />;
}

function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center">
        {/* Logo */}
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
          <Plane className="h-8 w-8 -rotate-12 text-slate-950" />
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AirBook
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Preparing your journey...
        </p>

        {/* Flight animation */}
        <div className="relative mt-12 h-16 w-full overflow-hidden">
          {/* Route line */}
          <div className="absolute left-0 right-0 top-8 h-px bg-slate-700" />

          {/* Dotted route */}
          <div className="absolute left-0 right-0 top-8 border-t border-dashed border-slate-500" />

          {/* Plane */}
          <div className="absolute top-[18px] animate-[fly_2.5s_ease-in-out_infinite]">
            <Plane className="h-7 w-7 -rotate-12 text-sky-400" />
          </div>
        </div>

        {/* Loading dots */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400" />
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-xs text-slate-500">
        Securely checking your account
      </div>

      <style jsx>{`
        @keyframes fly {
          0% {
            left: -10%;
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          50% {
            left: 45%;
            transform: translateX(-50%) translateY(-4px);
          }

          90% {
            opacity: 1;
          }

          100% {
            left: 110%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}