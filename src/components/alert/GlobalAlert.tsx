"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  hideAlert,
  type AlertType,
} from "@/store/slices/uiSlice";
import type { RootState, AppDispatch } from "@/store/store";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const alertConfig: Record<
  AlertType,
  {
    icon: typeof CheckCircle;
    titleClass: string;
    containerClass: string;
  }
> = {
  success: {
    icon: CheckCircle,
    titleClass: "text-green-700",
    containerClass: "border-green-200 bg-green-50",
  },

  error: {
    icon: XCircle,
    titleClass: "text-red-700",
    containerClass: "border-red-200 bg-red-50",
  },

  warning: {
    icon: AlertTriangle,
    titleClass: "text-yellow-700",
    containerClass: "border-yellow-200 bg-yellow-50",
  },

  info: {
    icon: Info,
    titleClass: "text-blue-700",
    containerClass: "border-blue-200 bg-blue-50",
  },
};

interface GlobalAlertProps {
  topOffset?: string;
}

export default function GlobalAlert({
  topOffset = "0px",
}: GlobalAlertProps) {
  const dispatch = useDispatch<AppDispatch>();
  const alert = useSelector(
    (state: RootState) => state.ui.globalAlert
  );

  useEffect(() => {
    if (!alert) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(hideAlert());
    }, 5000);

    return () => clearTimeout(timer);
  }, [alert, dispatch]);

  if (!alert) {
    return null;
  }

  const config = alertConfig[alert.type];
  const Icon = config.icon;

  return (
    <div
      className="sticky z-40 w-full border-b border-gray-200 bg-white px-2 py-2"
      style={{ top: topOffset }}
    >
      <div
        className={`flex w-full items-start gap-3 rounded-lg border px-4 py-2 ${config.containerClass}`}
      >
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${config.titleClass}`}
        />

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold ${config.titleClass}`}
          >
            {alert.title}
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {alert.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(hideAlert())}
          className="rounded-md p-1 text-gray-500 transition hover:bg-black/5 hover:text-gray-700"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}