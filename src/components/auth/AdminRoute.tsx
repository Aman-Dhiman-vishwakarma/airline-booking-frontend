"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({
  children,
}: AdminRouteProps) {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isInitialized,
  } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [
    isInitialized,
    isAuthenticated,
    user,
    router,
  ]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}