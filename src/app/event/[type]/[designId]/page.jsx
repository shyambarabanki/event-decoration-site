"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

function ErrorFallback({ error }) {
  console.error(error);
  return (
    <p className="text-red-600 p-4 text-center font-medium bg-red-50 rounded-lg">
      Something went wrong: {error.message}
    </p>
  );
}

// Generate time slots from 7 AM to 10 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

export default function DesignDetails({ params }) {
  const { type = "", designId = "" } = params || {};
  const router = useRouter();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [pincodeAvailable, setPincodeAvailable] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = generateTimeSlots();
  const calendarRef = useRef();

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await fetch(`https://www.phoolandbaloon.com/api/designs/${type}`);
        if (!res.ok) throw new Error("Failed to fetch designs");
        const data = await res.json();

        const selected = Array.isArray(data)
          ? data.find((d) => Number(d?.id) === Number(designId))
          : null;

        setDesign(selected || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (type && designId) fetchDesign();
    else setLoading(false);
  }, [type, designId]);

  // Auto-check pincode
  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length !== 6) {
        setPincodeAvailable(null);
        return;
      }

      setCheckingPincode(true);
      try {
        const res = await fetch("/api/check-pincode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pincode }),
        });
        if (!res.ok) throw new Error("Failed to check pincode");
        const data = await res.json();
        setPincodeAvailable(Boolean(data?.available));
      } catch (err) {
        console.error(err);
        alert("Failed to check pincode. Try again later.");
      } finally {
        setCheckingPincode(false);
      }
    };

    checkPincode();
  }, [pincode]);

  const handleBookNow = () => {
    if (!pincodeAvailable) return alert("Service is not available in your area!");
    if (!selectedDate || !selectedTime) return alert("Select date and time!");
    router.push(
      `/event/${type}/${designId}/verify-otp?pincode=${pincode}&date=${format(selectedDate, "yyyy-MM-dd")}&time=${selectedTime}`
    );
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;
  if (error) return <ErrorFallback error={error} />;
  if (!design) return <p className="p-6 text-center">Design not found.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 text-gray-900">
      <Navbar />

      <div className="flex flex-col md:flex-row pt-24 pb-20 px-4 md:px-12 gap-8 max-w-7xl mx-auto">
        {/* LEFT: Images */}
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

        {/* RIGHT: Description + Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex flex-col gap-6 bg-white p-6 md:p-10 rounded-3xl shadow-md border border-pink-100"
        >
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 tracking-tight">{design.name}</h1>
          <p className="text-gray-700 leading-relaxed">{design.description}</p>
          <p className="text-xl font-semibold text-purple-700">₹{design.price ?? "N/A"}</p>

          {/* PINCODE INPUT */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/, ""))}
              className="border border-pink-300 p-3 rounded-xl flex-1 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
            {checkingPincode && (
              <span className="flex items-center justify-center text-gray-500 text-sm">
                Checking...
              </span>
            )}
          </div>

          {/* PINCODE STATUS */}
          {pincodeAvailable != null && !checkingPincode && (
            <p className={`font-medium ${pincodeAvailable ? "text-green-600" : "text-red-600"}`}>
              {pincodeAvailable
                ? "✅ Service available in your area"
                : "❌ Not available in your area"}
            </p>
          )}

          {/* DATE & TIME PICKER */}
          {pincodeAvailable && (
            <div className="relative mt-3" ref={calendarRef}>
              <motion.div
                className="border border-pink-300 rounded-xl p-3 cursor-pointer bg-white flex justify-between items-center shadow-sm hover:shadow-md"
                onClick={() => setShowCalendar((prev) => !prev)}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-gray-600">
                  {selectedDate && selectedTime
                    ? `${format(selectedDate, "dd MMM yyyy")} | ${selectedTime}`
                    : "Select Date & Time"}
                </span>
                <span className="text-purple-600 font-bold">⌄</span>
              </motion.div>

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 mt-2 bg-white border border-pink-200 rounded-xl shadow-lg w-full p-4 max-h-96 overflow-y-auto"
                  >
                    {/* DATE SELECTION */}
                    <input
                      type="date"
                      min={format(new Date(), "yyyy-MM-dd")}
                      value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="border border-gray-300 rounded-md p-2 w-full mb-4"
                    />

                    {/* TIME SLOTS */}
                    {selectedDate && (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <motion.button
                            key={slot}
                            onClick={() => {
                              setSelectedTime(slot);
                              setShowCalendar(false);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-xl text-sm font-medium ${
                              selectedTime === slot
                                ? "bg-purple-600 text-white"
                                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            } transition-all`}
                          >
                            {slot}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CONDITIONAL BUTTON */}
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
