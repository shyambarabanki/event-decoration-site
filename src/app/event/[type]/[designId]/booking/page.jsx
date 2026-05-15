"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../../../../components/Navbar";
import { reportClientError } from "../../../../components/ErrorReporter";

export default function BookingPage({ params }) {
  const router = useRouter();
  const { type, designId } = params;
  const searchParams = useSearchParams();

  const verified = searchParams.get("verified") === "true";

  const mobileFromQuery = searchParams.get("mobile") || "";
  const pincode = searchParams.get("pincode") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";

  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [mobile, setMobile] = useState(mobileFromQuery);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isMobileValid = (value) => /^\d{10}$/.test(String(value || "").trim());

  const finalMobile = useMemo(() => {
    return verified ? mobileFromQuery : mobile;
  }, [verified, mobileFromQuery, mobile]);

  const handleCheckout = async () => {
    const cleanedDetails = Object.fromEntries(
      Object.entries(bookingDetails).map(([key, value]) => [
        key,
        String(value || "").trim(),
      ])
    );

    const emptyField = Object.entries(cleanedDetails).find(([_, v]) => !v);
    if (emptyField) return alert(`Please fill ${emptyField[0]}`);

    if (!verified && !isMobileValid(mobile)) {
      return alert("Please enter a valid 10-digit mobile number");
    }

    if (!verified && !String(mobile).trim()) {
      return alert("Please enter mobile number");
    }

    if (!verified && mobileFromQuery && mobile !== mobileFromQuery) {
      // optional: allow user to edit mobile if they came without verification
    }

    if (!designId || !pincode || !date || !time) {
      return alert("Missing booking details from previous step");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/save-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId,
          type,
          mobile: finalMobile,
          pincode,
          date,
          time,
          paymentStatus: "pending",
          bookingType: "pre-booking",
          verified,
          ...cleanedDetails,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingId(data.bookingId || null);
        setShowPayment(true);
      } else {
        alert(data.error || data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      reportClientError("booking/checkout", err, { designId, type });
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    try {
      await fetch("/api/update-booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          paymentMode: "cod",
          paymentStatus: "pending",
        }),
      });
    } catch (err) {
      console.error(err);
      reportClientError("booking/cod", err, { bookingId });
    }

    alert("✅ Booking confirmed with Cash on Delivery!");
    router.push("/?status=success");
  };

  const handlePayLater = async () => {
    try {
      await fetch("/api/update-booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          paymentMode: "pay_later",
          paymentStatus: "pending",
        }),
      });
    } catch (err) {
      console.error(err);
      reportClientError("booking/pay-later", err, { bookingId });
    }

    alert("✅ Booking confirmed. You can pay later!");
    router.push("/?status=success");
  };

  const handleRazorpayPayment = async () => {
    const amount = 500;

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bookingId }),
      });

      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Phool & Balloon",
        description: "Booking Payment",
        order_id: order.id,
        handler: function (response) {
          alert(
            `✅ Payment Successful! Payment ID: ${response.razorpay_payment_id}`
          );
          router.push("/?status=success");
        },
        theme: { color: "#f72585" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      reportClientError("booking/razorpay", err, { bookingId });
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <div className="pt-32 md:pt-36 p-4 md:p-8 max-w-md mx-auto">
        {!showPayment ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Enter Booking Details
            </h2>

            {!verified ? (
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="border rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
              />
            ) : (
              <div className="mb-3 rounded-lg border bg-white p-3 text-gray-700">
                📱 Mobile: {mobileFromQuery}
              </div>
            )}

            {["name", "address", "city", "state", "zip"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={bookingDetails[field]}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    [field]: e.target.value,
                  })
                }
                className="border rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
              />
            ))}

            <div className="mb-4 text-gray-700">
              <p>📍 Pincode: {pincode}</p>
              <p>
                📅 Date: {date}, ⏰ Time: {time}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-pink-500 text-white px-4 py-3 rounded-lg w-full font-semibold"
            >
              {loading ? "Submitting..." : "Proceed to Payment"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Select Payment Mode
            </h2>

            {bookingId ? (
              <div className="mb-4 rounded-lg border bg-white p-3 text-center text-gray-700">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Guest booking ID
                </p>
                <p className="font-bold text-gray-900">{bookingId}</p>
                <Link
                  href="/my-orders"
                  className="mt-2 inline-flex text-sm font-semibold text-pink-600 hover:text-purple-700"
                >
                  View in My Orders
                </Link>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <button
                onClick={handleRazorpayPayment}
                className="bg-purple-600 text-white py-3 rounded-lg w-full font-semibold"
              >
                💳 Pay Online (Card/UPI/Wallet)
              </button>

              <button
                onClick={handleCOD}
                className="bg-gray-200 text-gray-800 py-3 rounded-lg w-full font-semibold"
              >
                🏠 Cash on Delivery (COD)
              </button>

              <button
                onClick={handlePayLater}
                className="bg-blue-600 text-white py-3 rounded-lg w-full font-semibold"
              >
                ⏳ Book Now, Pay Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
