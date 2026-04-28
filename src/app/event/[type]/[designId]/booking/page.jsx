"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../../../../../components/Navbar";

export default function BookingPage({ params }) {
  const router = useRouter();
  const { type, designId } = params;
  const searchParams = useSearchParams();

  const mobile = searchParams.get("mobile");
  const pincode = searchParams.get("pincode");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Save booking first, then show payment options
  const handleCheckout = async () => {
    const emptyField = Object.entries(bookingDetails).find(([_, v]) => !v.trim());
    if (emptyField) return alert(`Please fill ${emptyField[0]}`);

    setLoading(true);
    try {
      const res = await fetch("/api/save-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId,
          mobile,
          pincode,
          date,
          time,
          ...bookingDetails,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingId(data.bookingId); // Save returned bookingId
        setShowPayment(true); // Show payment options
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Handle COD
  const handleCOD = async () => {
    alert("✅ Booking confirmed with Cash on Delivery!");
    router.push("/?status=success");
  };

  // 3️⃣ Razorpay Payment
  const handleRazorpayPayment = async () => {
    const amount = 500; // or dynamically calculate from booking/design
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
          alert(`✅ Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          router.push("/?status=success");
        },
        theme: { color: "#f72585" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />
      <div className="pt-32 md:pt-36 p-4 md:p-8 max-w-md mx-auto">
        {!showPayment ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Enter Booking Details</h2>

            {["name", "address", "city", "state", "zip"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={bookingDetails[field]}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, [field]: e.target.value })
                }
                className="border rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
              />
            ))}

            <div className="mb-4 text-gray-700">
              <p>📱 Mobile: {mobile}</p>
              <p>📍 Pincode: {pincode}</p>
              <p>📅 Date: {date}, ⏰ Time: {time}</p>
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
            <h2 className="text-2xl font-bold mb-4 text-center">Select Payment Mode</h2>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
