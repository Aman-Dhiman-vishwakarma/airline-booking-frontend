"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

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
      const loginUrl = `/login?redirect=${encodeURIComponent(
        pathname
      )}`;

      router.replace(loginUrl);
    }
  }, [
    isInitialized,
    isAuthenticated,
    user,
    pathname,
    router,
  ]);

  /*
   * AuthInitializer abhi session verify kar raha hai.
   * Jab tak verification complete nahi hoti,
   * protected content render nahi karenge.
   */
  if (!isInitialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}