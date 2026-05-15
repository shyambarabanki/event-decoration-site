"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../../../components/Navbar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { reportClientError } from "../../../components/ErrorReporter";

function ErrorFallback({ error }) {
  useEffect(() => {
    console.error(error);
    reportClientError("design-details/render", error);
  }, [error]);

  return (
    <p className="text-red-600 p-4 text-center font-medium bg-red-50 rounded-lg">
      Something went wrong: {error.message}
    </p>
  );
}

const SERVICEABLE_LABEL = {
  true: "✅ Service available in your area",
  false: "❌ Not available in your area",
};

function getLocalDateTimeValue(date = new Date(), addMinutes = 0) {
  const next = new Date(date.getTime() + addMinutes * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = next.getFullYear();
  const mm = pad(next.getMonth() + 1);
  const dd = pad(next.getDate());
  const hh = pad(next.getHours());
  const min = pad(next.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function addDaysToDateTime(days, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);

  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function DesignDetails() {
  const params = useParams();
  const type = params?.type?.toLowerCase() || "";
  const designId = params?.designId || "";

  const router = useRouter();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pincode, setPincode] = useState("");
  const [pincodeAvailable, setPincodeAvailable] = useState(null);
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);

  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await fetch(`/api/designs/${type}`);
        if (!res.ok) throw new Error("Failed to fetch designs");

        const data = await res.json();

        const selected = Array.isArray(data)
          ? data.find((d) => String(d?.id) === String(designId))
          : null;

        setDesign(selected || null);
      } catch (err) {
        reportClientError("design-details/fetch-design", err, { type, designId });
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (type && designId) fetchDesign();
    else setLoading(false);
  }, [type, designId]);

  useEffect(() => {
    const checkPincode = async () => {
      const normalized = String(pincode || "").trim();

      if (normalized.length !== 6) {
        setPincodeAvailable(null);
        setPincodeMessage("");
        return;
      }

      setCheckingPincode(true);
      try {
        const res = await fetch("/api/check-pincode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pincode: normalized }),
        });

        const data = await res.json();

        setPincodeAvailable(Boolean(data?.available));
        setPincodeMessage(data?.message || "");

        if (!data?.success && data?.message) {
          setPincodeAvailable(false);
        }
      } catch (err) {
        console.error(err);
        reportClientError("design-details/check-pincode", err, { pincode });
        setPincodeAvailable(false);
        setPincodeMessage("Failed to check pincode. Try again later.");
      } finally {
        setCheckingPincode(false);
      }
    };

    checkPincode();
  }, [pincode]);

  const handleBookNow = () => {
    if (!pincodeAvailable) return alert("Service is not available in your area!");
    if (!selectedDateTime) return alert("Select date and time!");

    const [datePart, timePart] = selectedDateTime.split("T");

    router.push(
      `/event/${type}/${designId}/verify-otp?pincode=${pincode}&date=${datePart}&time=${timePart}`
    );
  };

  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;
  if (error) return <ErrorFallback error={error} />;
  if (!design) return <p className="p-6 text-center">Design not found.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 text-gray-900">
      <Navbar />

      <div className="flex flex-col md:flex-row pt-24 pb-20 px-4 md:px-12 gap-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex flex-col gap-4"
        >
          <img
            src={design.image || "/placeholder.png"}
            alt={design.name || "Design Image"}
            className="w-full h-[400px] md:h-[600px] object-cover rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex flex-col gap-6 bg-white p-6 md:p-10 rounded-3xl shadow-md border border-pink-100"
        >
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 tracking-tight">
            {design.name}
          </h1>
          <p className="text-gray-700 leading-relaxed">{design.description}</p>
          <p className="text-xl font-semibold text-purple-700">
            ₹{design.price ?? "N/A"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              className="border border-pink-300 p-3 rounded-xl flex-1 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
            {checkingPincode && (
              <span className="flex items-center justify-center text-gray-500 text-sm">
                Checking...
              </span>
            )}
          </div>

          {pincodeMessage && !checkingPincode && (
            <p
              className={`font-medium ${
                pincodeAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {pincodeMessage || SERVICEABLE_LABEL[String(pincodeAvailable)]}
            </p>
          )}

          {pincodeAvailable && (
            <div className="mt-2 space-y-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select date and time
                </label>

                <input
                  type="datetime-local"
                  min={getLocalDateTimeValue(new Date(), 0)}
                  value={selectedDateTime}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  className="border border-pink-300 p-3 rounded-xl w-full text-black focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDateTime(getLocalDateTimeValue(new Date(), 60))}
                  className="px-3 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-all"
                >
                  In 1 hour
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDateTime(addDaysToDateTime(0, 18, 0))}
                  className="px-3 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-all"
                >
                  Today 6:00 PM
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDateTime(addDaysToDateTime(1, 10, 0))}
                  className="px-3 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-all"
                >
                  Tomorrow 10:00 AM
                </button>
              </div>

              {selectedDateTime && (
                <p className="text-sm text-gray-600">
                  Selected: {format(new Date(selectedDateTime), "dd MMM yyyy, hh:mm a")}
                </p>
              )}
            </div>
          )}

          {pincodeAvailable ? (
            <motion.button
              onClick={handleBookNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold px-10 py-3 rounded-full shadow-md hover:shadow-xl hover:opacity-90 transition-all mt-4"
            >
              Book Now
            </motion.button>
          ) : pincodeAvailable === false ? (
            <motion.button
              onClick={() => router.push("/enquiry")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="bg-yellow-500 text-white text-lg font-semibold px-10 py-3 rounded-full shadow-md hover:shadow-xl hover:opacity-90 transition-all mt-4"
            >
              Enquiry
            </motion.button>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
