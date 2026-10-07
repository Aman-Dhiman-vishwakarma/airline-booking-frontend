"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({
  children,
}: PublicRouteProps) {
  const router = useRouter();

  const {
    isAuthenticated,
    isInitialized,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
