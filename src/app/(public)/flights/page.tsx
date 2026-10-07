import { Suspense } from "react";
import FlightsContent from "./FlightsContent";

export default function FlightsPage() {
  return (
    <Suspense fallback={<FlightsLoading />}>
      <FlightsContent />
    </Suspense>
  );
}

function FlightsLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-6 h-10 w-64 rounded bg-slate-200" />
          <div className="mt-8 space-y-4">
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}