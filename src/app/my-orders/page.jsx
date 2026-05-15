"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Loader2,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
} from "lucide-react";
import { reportClientError } from "../components/ErrorReporter";

function formatDateTime(date, time) {
  if (!date && !time) return "Slot not selected";

  const parsed = date && time ? new Date(`${date}T${time}`) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return [date, time].filter(Boolean).join(", ");
}

function statusLabel(order) {
  if (order.paymentStatus && order.paymentStatus !== "pending") return order.paymentStatus;
  return order.status || "created";
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/my-orders", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "Failed to load orders");
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error(err);
        reportClientError("my-orders/load", err);
        setError("Could not load your orders right now.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const orderCountLabel = useMemo(() => {
    if (loading) return "Loading orders";
    return orders.length === 1 ? "1 order in this browser" : `${orders.length} orders in this browser`;
  }, [loading, orders.length]);

  return (
    <div className="min-h-screen bg-[#f6f7f2] px-4 pb-12 pt-5 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-lg bg-gray-950 p-5 text-white shadow-xl sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-teal-400 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-gray-950">
                <PackageCheck size={15} aria-hidden="true" />
                Guest order history
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                My Orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Orders placed from this browser appear here. No login is required.
              </p>
            </div>
            <span className="w-fit rounded-md border border-white/15 px-3 py-2 text-sm font-bold text-white/80">
              {orderCountLabel}
            </span>
          </div>
        </section>

        {loading ? (
          <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-lg border border-gray-200 bg-white">
            <Loader2 className="mr-2 animate-spin text-teal-600" size={22} />
            <span className="font-bold text-gray-700">Loading your orders...</span>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-lg border border-red-100 bg-white p-6 text-center shadow-sm">
            <p className="font-bold text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-gray-950 px-4 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <ReceiptText className="mx-auto text-gray-300" size={48} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              You can browse and book as a guest. Once you place an order, it will
              show up here on this browser.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-md bg-teal-500 px-5 py-3 text-sm font-extrabold text-gray-950 shadow-lg shadow-teal-100"
            >
              Browse decorations
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.bookingId}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-gray-950 px-3 py-1.5 text-xs font-extrabold text-white">
                        {order.bookingId}
                      </span>
                      <span className="rounded-md bg-teal-50 px-3 py-1.5 text-xs font-bold capitalize text-teal-700">
                        {statusLabel(order)}
                      </span>
                      <span className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                        {order.verified ? "Verified" : "Guest checkout"}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-black capitalize text-gray-950">
                      {order.type || "Decoration"} booking
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.name ? `Booked by ${order.name}` : "Booking details saved"}
                    </p>
                  </div>
                  <Link
                    href={`/event/${order.type || "birthday"}`}
                    className="rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-bold text-gray-800 transition hover:border-teal-400 hover:text-teal-700"
                  >
                    Book similar
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="flex gap-3 rounded-md bg-gray-50 p-3">
                    <CalendarDays className="shrink-0 text-teal-700" size={19} />
                    <span>
                      <span className="block text-xs font-bold uppercase text-gray-500">
                        Slot
                      </span>
                      <span className="block text-sm font-bold text-gray-900">
                        {formatDateTime(order.date, order.time)}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-3 rounded-md bg-gray-50 p-3">
                    <MapPin className="shrink-0 text-teal-700" size={19} />
                    <span>
                      <span className="block text-xs font-bold uppercase text-gray-500">
                        Area
                      </span>
                      <span className="block text-sm font-bold text-gray-900">
                        {order.pincode || order.city || "Not added"}
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-3 rounded-md bg-gray-50 p-3">
                    <Phone className="shrink-0 text-teal-700" size={19} />
                    <span>
                      <span className="block text-xs font-bold uppercase text-gray-500">
                        Mobile
                      </span>
                      <span className="block text-sm font-bold text-gray-900">
                        {order.mobile || "Not added"}
                      </span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

