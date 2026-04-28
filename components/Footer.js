"use client";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const phoneNumber = "+916389012486";

  const handleDesktopCall = () => {
    alert(`Call us at ${phoneNumber}`);
  };

  return (
    <>
      {/* 🌸 Mobile Floating Buttons (Compact + Minimal) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden z-50">
        <a
          href={`tel:${phoneNumber}`}
          className="relative flex items-center gap-1 bg-transparent text-pink-600 font-semibold px-2 py-1.5 rounded-full shadow-md hover:scale-110 transition-all duration-300 text-xs"
        >
          <FaPhone className="w-3.5 h-3.5" /> Call
          <span className="absolute -inset-0.5 rounded-full bg-pink-300 blur-xl opacity-40 animate-pulse-slow pointer-events-none"></span>
        </a>

        <a
          href="https://wa.me/7007535922"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-1 bg-transparent text-green-600 font-semibold px-2 py-1.5 rounded-full shadow-md hover:scale-110 transition-all duration-300 text-xs"
        >
          <FaWhatsapp className="w-3.5 h-3.5" /> Chat
          <span className="absolute -inset-0.5 rounded-full bg-green-300 blur-xl opacity-40 animate-pulse-slow pointer-events-none"></span>
        </a>
      </div>

      {/* 💻 Desktop Floating Sidebar */}
      <div className="hidden sm:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-6 z-50">
        <div className="group relative">
          <button
            onClick={handleDesktopCall}
            className="relative flex items-center justify-center w-14 h-14 bg-transparent text-pink-500 rounded-full shadow-xl hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,182,193,0.8)] animate-call-shake"
          >
            <FaPhone className="w-5 h-5" />
            <span className="absolute -inset-2 rounded-full bg-pink-300 blur-3xl opacity-40 animate-pulse-slow pointer-events-none"></span>
          </button>
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-2.5 py-1 rounded-lg bg-white shadow-lg text-xs font-semibold text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Call Us
          </span>
        </div>

        <div className="group relative">
          <a
            href="https://wa.me/7007535922"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 bg-transparent text-green-500 rounded-full shadow-xl hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,0,0.6)]"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span className="absolute -inset-2 rounded-full bg-green-300 blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></span>
          </a>
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-2.5 py-1 rounded-lg bg-white shadow-lg text-xs font-semibold text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            WhatsApp
          </span>
        </div>
      </div>

      {/* 🎨 Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes call-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-1px, 1px) rotate(-2deg); }
          40% { transform: translate(1px, -1px) rotate(2deg); }
          60% { transform: translate(-1px, 1px) rotate(-1deg); }
          80% { transform: translate(1px, -1px) rotate(1deg); }
        }
        .animate-call-shake {
          animation: call-shake 0.5s infinite;
        }
      `}</style>
    </>
  );
}
