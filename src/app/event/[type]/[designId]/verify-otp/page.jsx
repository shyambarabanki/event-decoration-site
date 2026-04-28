"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../../../../../components/Navbar";

export default function VerifyOtp({ params }) {
  const { type = "", designId = "" } = params || {};
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // To show "Hi User" in Navbar

  const pincode = searchParams?.get("pincode") || "";
  const date = searchParams?.get("date") || "";
  const time = searchParams?.get("time") || "";

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/get-token");
        if (!res.ok) throw new Error("Failed to get auth token");
        const data = await res.json();
        if (data?.success && data?.token) setAuthToken(data.token);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    fetchToken();
  }, []);

  const handleSendOtp = async () => {
    if (!mobile.trim()) return alert("Enter mobile number");
    if (!authToken) return alert("Authorization failed");

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim(), token: authToken }),
      });
      const result = await res.json();
      const verification = result?.data?.data?.verificationId;
      if (result?.success && verification) {
        setOtpSent(true);
        setVerificationId(verification);
        alert(`✅ OTP sent to ${mobile}`);
      } else {
        alert(result?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return alert("Enter OTP");
    if (!verificationId) return alert("Send OTP first");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken || "",
        },
        body: JSON.stringify({ verificationId, code: otp.trim() }),
      });
      const data = await res.json();
      if (data?.success) {
        alert("✅ OTP Verified Successfully!");
        setUser(mobile); // Set user to show in navbar
        router.push(
          `/event/${type}/${designId}/booking?mobile=${mobile}&pincode=${pincode}&date=${date}&time=${time}`
        );
      } else {
        alert(data?.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="p-4 text-red-600">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-100 flex flex-col">
      {/* Pass user state to Navbar to show "Hi User" */}
      <Navbar user={user} />

      <div className="flex-1 overflow-auto">
        <div className="pt-36 md:pt-40 px-4 md:px-8 max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Verify Mobile Number
          </h2>

          {!otpSent ? (
            <>
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border border-gray-300 p-2 sm:p-3 w-full mb-4 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
              />
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl w-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 p-2 sm:p-3 w-full mb-4 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl w-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
