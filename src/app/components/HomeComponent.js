"use client";

import { useEffect, useState } from "react";
import EventCard from "../../../components/EventCard";
import Carousel from "../../../components/Carousel";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function HomeComponent() {
  const searchParams = useSearchParams();
  const [showMessage, setShowMessage] = useState(false);

  const events = [
    { title: "Birthday", image: "/birthday1.jpg" },
    { title: "Anniversary", image: "/anniversary1.jpg" },
    { title: "Marriage", image: "/marriage1.jpg" },
    { title: "Corporate Party", image: "/corporate.jpg" },
    { title: "Any Other", image: "/party.jpg" },
  ];

  const blobs = [
    { top: "10%", left: "-10%", width: 300, height: 400, color: "bg-purple-400/30", blur: "blur-3xl" },
    { top: "30%", right: "-15%", width: 350, height: 350, color: "bg-pink-400/25", blur: "blur-3xl" },
    { top: "60%", left: "-5%", width: 250, height: 300, color: "bg-indigo-400/20", blur: "blur-2xl" },
    { bottom: "5%", right: "-10%", width: 400, height: 400, color: "bg-yellow-300/15", blur: "blur-3xl" },
  ];

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, (_, i) => ({
      size: Math.floor(Math.random() * 20) + 12,
      top: Math.random() * 100,
      left: Math.random() * 100,
      color: ["#FFB6C1", "#C8A2C8", "#93C6E0", "#FFD700"][i % 4],
      delay: Math.random() * 5,
      duration: Math.random() * 12 + 5,
    }));
    setParticles(generated);
  }, []);

  // Show success banner if redirected
  useEffect(() => {
    if (searchParams.get("status") === "success") {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="bg-gray-50 min-h-screen relative overflow-x-hidden">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            ✅ Booking successful! We’ll contact you soon.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Carousel */}
      <section className="relative w-full h-[520px] md:h-[600px] rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600 via-pink-500 to-indigo-500 opacity-40 z-0" />
        <div className="relative z-10 h-full">
          <Carousel />
        </div>
      </section>

      {/* Event Cards */}
      <section className="relative z-20 max-w-7xl mx-auto -mt-36 px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {blobs.map((blob, idx) => (
          <div
            key={idx}
            className={`fixed ${blob.blur} rounded-full pointer-events-none z-0 ${blob.color}`}
            style={{
              width: `${blob.width}px`,
              height: `${blob.height}px`,
              top: blob.top || "auto",
              bottom: blob.bottom || "auto",
              left: blob.left || "auto",
              right: blob.right || "auto",
            }}
          />
        ))}

        {particles.map((p, idx) => (
          <div
            key={idx}
            className="fixed rounded-full opacity-20 blur-lg animate-float-slow pointer-events-none"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

        {events.map((e, i) => (
          <div
            key={i}
            id={e.title.toLowerCase().replace(/\s+/g, "-")}
            className="relative z-10 transition-transform duration-500 hover:-translate-y-3 hover:scale-[1.05]"
          >
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-pink-400 hover:ring-opacity-50 h-full">
              <EventCard {...e} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
