"use client";

import { useEffect } from "react";
import Link from "next/link";
import { reportClientError } from "./components/ErrorReporter";

export default function AppError({ error, reset }) {
  useEffect(() => {
    reportClientError("app/error-boundary", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center text-gray-900">
      <div className="rounded-lg border border-red-100 bg-white p-6 shadow-lg">
        <p className="text-sm font-bold uppercase tracking-wide text-red-600">
          Something went wrong
        </p>
        <h1 className="mt-2 text-2xl font-black">We could not load this screen.</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          The error was logged. You can try again or return home.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-gray-950 px-4 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-gray-300 px-4 py-3 text-sm font-bold text-gray-800"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
