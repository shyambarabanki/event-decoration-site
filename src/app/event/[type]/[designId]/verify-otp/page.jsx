"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { reportClientError } from "../../../../components/ErrorReporter";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const noticeStyles = {
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function cleanDigits(value, maxLength) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, maxLength);
}

function isMobileValid(value) {
  return /^\d{10}$/.test(String(value || ""));
}

function maskMobile(value) {
  if (!isMobileValid(value)) return value || "Mobile not added";
  return `${value.slice(0, 2)} **** ${value.slice(6)}`;
}

function formatBookingTime(date, time) {
  if (!date && !time) return "Not selected";

  const combined = date && time ? new Date(`${date}T${time}`) : null;
  if (combined && !Number.isNaN(combined.getTime())) {
    return combined.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return [date, time].filter(Boolean).join(", ");
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/25 py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-teal-700 shadow-sm">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-white/70">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-white">
          {value || "Not selected"}
        </span>
      </span>
    </div>
  );
}

function Step({ active, complete, label }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${
          complete
            ? "border-emerald-500 bg-emerald-500 text-white"
            : active
              ? "border-teal-500 bg-teal-50 text-teal-700"
              : "border-gray-200 bg-white text-gray-400"
        }`}
      >
        {complete ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
      </span>
      <span
        className={`truncate text-xs font-semibold sm:text-sm ${
          active || complete ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function VerifyOtp() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const otpRefs = useRef([]);

  const type = String(params?.type || "");
  const designId = String(params?.designId || "");

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState("");
  const [notice, setNotice] = useState(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const pincode = searchParams?.get("pincode") || "";
  const date = searchParams?.get("date") || "";
  const time = searchParams?.get("time") || "";

  const mobileReady = isMobileValid(mobile);
  const otpReady = otp.length >= 4;
  const bookingTimeLabel = useMemo(() => formatBookingTime(date, time), [date, time]);
  const otpDigits = useMemo(
    () => Array.from({ length: OTP_LENGTH }, (_, index) => otp[index] || ""),
    [otp]
  );

  useEffect(() => {
    const fetchToken = async () => {
      setTokenLoading(true);
      setTokenError("");

      try {
        const res = await fetch("/api/get-token");
        if (!res.ok) throw new Error("Failed to get auth token");

        const data = await res.json();
        if (data?.success && data?.token) {
          setAuthToken(data.token);
          return;
        }

        throw new Error(data?.message || "OTP service is unavailable");
      } catch (err) {
        console.error(err);
        reportClientError("verify-otp/token", err);
        setTokenError("OTP service is not connected right now.");
      } finally {
        setTokenLoading(false);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!resendSeconds) return undefined;

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const bookingUrl = (verified) => {
    const query = new URLSearchParams({
      mobile: verified || mobileReady ? mobile : "",
      pincode,
      date,
      time,
      verified: String(verified),
    });

    return `/event/${type}/${designId}/booking?${query.toString()}`;
  };

  const handleMobileChange = (event) => {
    setMobile(cleanDigits(event.target.value, 10));
    setNotice(null);
  };

  const handleSendOtp = async () => {
    if (!mobileReady) {
      setNotice({ type: "error", text: "Enter a valid 10-digit mobile number." });
      return;
    }

    if (!authToken) {
      setNotice({
        type: "error",
        text: tokenError || "OTP service is still connecting. Try again in a moment.",
      });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, token: authToken }),
      });

      const result = await res.json();
      const verification = result?.data?.data?.verificationId;

      if (result?.success && verification) {
        setOtp("");
        setOtpSent(true);
        setVerificationId(verification);
        setResendSeconds(RESEND_SECONDS);
        setNotice({
          type: "success",
          text: `OTP sent to ${maskMobile(mobile)}.`,
        });

        window.setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setNotice({
          type: "error",
          text: result?.message || result?.error || "Failed to send OTP.",
        });
      }
    } catch (err) {
      console.error(err);
      reportClientError("verify-otp/send", err, { mobile });
      setNotice({ type: "error", text: "Error sending OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpReady) {
      setNotice({ type: "error", text: "Enter the OTP sent to your mobile." });
      return;
    }

    if (!verificationId) {
      setNotice({ type: "error", text: "Send OTP before verifying." });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken || "",
        },
        body: JSON.stringify({ verificationId, code: otp }),
      });

      const data = await res.json();

      if (data?.success) {
        setNotice({ type: "success", text: "Mobile verified. Opening booking details." });
        router.push(bookingUrl(true));
      } else {
        setNotice({ type: "error", text: data?.error || "Invalid OTP." });
      }
    } catch (err) {
      console.error(err);
      reportClientError("verify-otp/verify", err, { mobile });
      setNotice({ type: "error", text: "Error verifying OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleProceedWithoutVerification = () => {
    router.push(bookingUrl(false));
  };

  const handleOtpChange = (index, value) => {
    const incomingDigits = cleanDigits(value, OTP_LENGTH);

    if (!incomingDigits) {
      const nextDigits = otp.padEnd(OTP_LENGTH, " ").split("");
      nextDigits[index] = " ";
      setOtp(nextDigits.join("").replace(/\s/g, "").slice(0, OTP_LENGTH));
      return;
    }

    const nextDigits = otp.padEnd(OTP_LENGTH, " ").split("");
    incomingDigits.split("").forEach((digit, offset) => {
      if (index + offset < OTP_LENGTH) nextDigits[index + offset] = digit;
    });

    setOtp(nextDigits.join("").replace(/\s/g, "").slice(0, OTP_LENGTH));

    const nextIndex = Math.min(index + incomingDigits.length, OTP_LENGTH - 1);
    window.setTimeout(() => otpRefs.current[nextIndex]?.focus(), 0);
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
      return;
    }

    if (event.key !== "Backspace") return;

    event.preventDefault();
    const nextDigits = otp.padEnd(OTP_LENGTH, " ").split("");

    if (nextDigits[index]?.trim()) {
      nextDigits[index] = " ";
      setOtp(nextDigits.join("").replace(/\s/g, "").slice(0, OTP_LENGTH));
      return;
    }

    if (index > 0) {
      nextDigits[index - 1] = " ";
      setOtp(nextDigits.join("").replace(/\s/g, "").slice(0, OTP_LENGTH));
      otpRefs.current[index - 1]?.focus();
    }
  };

  const resetMobile = () => {
    setOtp("");
    setOtpSent(false);
    setVerificationId(null);
    setResendSeconds(0);
    setNotice(null);
    window.setTimeout(() => document.getElementById("mobile")?.focus(), 0);
  };

  return (
    <div className="bg-[#f7f8f4] text-gray-950">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 pb-8 pt-4 sm:px-6 lg:min-h-[calc(100vh-8rem)] lg:px-8">
        <div className="grid w-full gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6">
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative order-2 min-h-[240px] overflow-hidden rounded-lg bg-gray-950 text-white shadow-xl lg:order-1 lg:min-h-[620px]"
          >
            <Image
              src="/carousel2.jpg"
              alt="Event decoration setup"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/20" />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-7 lg:p-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex w-fit items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back
              </button>

              <div className="mt-10 max-w-md lg:mt-0">
                <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-teal-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-950">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Secure checkpoint
                </p>
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Confirm your mobile before booking.
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                  Your booking slot and service area stay visible while you verify.
                </p>
              </div>

              <div className="mt-8 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <SummaryRow icon={MapPin} label="Pincode" value={pincode} />
                <SummaryRow icon={CalendarDays} label="Slot" value={bookingTimeLabel} />
                <SummaryRow icon={Clock3} label="Next step" value="Booking details" />
              </div>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="order-1 rounded-lg border border-gray-200 bg-white shadow-xl lg:order-2"
          >
            <div className="border-b border-gray-100 p-4 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Step label="Mobile" active={!otpSent} complete={otpSent} />
                <span className="h-px w-6 bg-gray-200 sm:w-10" />
                <Step label="OTP" active={otpSent} complete={false} />
                <span className="h-px w-6 bg-gray-200 sm:w-10" />
                <Step label="Booking" active={false} complete={false} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-teal-700">
                    {otpSent ? "OTP verification" : "Mobile verification"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    {otpSent ? "Enter your code" : "Where should we send the OTP?"}
                  </h2>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
                  {tokenLoading ? (
                    <Loader2 className="animate-spin text-teal-600" size={15} aria-hidden="true" />
                  ) : authToken ? (
                    <LockKeyhole className="text-emerald-600" size={15} aria-hidden="true" />
                  ) : (
                    <LockKeyhole className="text-red-500" size={15} aria-hidden="true" />
                  )}
                  {tokenLoading ? "Connecting" : authToken ? "OTP ready" : "OTP offline"}
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_0.72fr]">
              <div className="space-y-5">
                {!otpSent ? (
                  <div className="space-y-4">
                    <label htmlFor="mobile" className="block text-sm font-semibold text-gray-800">
                      Mobile number
                    </label>

                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                        aria-hidden="true"
                      />
                      <input
                        id="mobile"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={handleMobileChange}
                        aria-invalid={mobile.length > 0 && !mobileReady}
                        className="h-12 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-base font-semibold text-gray-950 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Service
                        </span>
                        <span className="mt-1 block text-sm font-bold text-gray-900">
                          {pincode || "Selected area"}
                        </span>
                      </div>
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Slot
                        </span>
                        <span className="mt-1 block truncate text-sm font-bold text-gray-900">
                          {bookingTimeLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || tokenLoading}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                      ) : (
                        <MessageSquareText size={18} aria-hidden="true" />
                      )}
                      {loading ? "Sending OTP" : "Send OTP"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-teal-700 shadow-sm">
                          <Phone size={18} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Sent to
                          </span>
                          <span className="block truncate text-sm font-bold text-gray-950">
                            {maskMobile(mobile)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={resetMobile}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-teal-300 hover:text-teal-700"
                      >
                        <Edit3 size={14} aria-hidden="true" />
                        Edit
                      </button>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-semibold text-gray-800">
                        OTP code
                      </label>
                      <div className="grid grid-cols-6 gap-2 sm:gap-3">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            ref={(node) => {
                              otpRefs.current[index] = node;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete={index === 0 ? "one-time-code" : "off"}
                            aria-label={`OTP digit ${index + 1}`}
                            value={digit}
                            onChange={(event) => handleOtpChange(index, event.target.value)}
                            onKeyDown={(event) => handleOtpKeyDown(index, event)}
                            onPaste={(event) => {
                              event.preventDefault();
                              handleOtpChange(index, event.clipboardData.getData("text"));
                            }}
                            className="h-12 w-full rounded-md border border-gray-300 bg-white text-center text-lg font-bold text-gray-950 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 sm:h-14 sm:text-xl"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading || !otpReady}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                        ) : (
                          <ShieldCheck size={18} aria-hidden="true" />
                        )}
                        {loading ? "Verifying" : "Verify and continue"}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || resendSeconds > 0}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-bold text-gray-800 transition hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        <RefreshCw size={16} aria-hidden="true" />
                        {resendSeconds ? `${resendSeconds}s` : "Resend"}
                      </button>
                    </div>
                  </div>
                )}

                {notice ? (
                  <div
                    className={`rounded-md border px-4 py-3 text-sm font-semibold ${
                      noticeStyles[notice.type] || noticeStyles.info
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {notice.text}
                  </div>
                ) : null}

                {tokenError && !authToken ? (
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                    {tokenError}
                  </div>
                ) : null}
              </div>

              <aside className="flex flex-col justify-between rounded-md border border-gray-200 bg-[#f9faf7] p-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-950">Fast confirmation</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Verified bookings move straight to address and payment details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                      <LockKeyhole size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-950">Private by default</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        The mobile number is only used for this booking flow.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedWithoutVerification}
                  disabled={loading}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-bold text-gray-800 transition hover:border-gray-950 hover:text-gray-950 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  Continue without OTP
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </aside>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
