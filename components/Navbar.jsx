"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, PackageCheck } from "lucide-react";

export default function Navbar() {
  const [location, setLocation] = useState("Lucknow");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 🔹 Detect scroll position
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Set mobile browser top bar color
  useEffect(() => {
    const themeColor = "#25b4aa";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColor);
    else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = themeColor;
      document.head.appendChild(newMeta);
    }
  }, []);

  // 🔹 Fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gradient-to-b from-teal-50/95 to-white/95 shadow-sm border-b border-gray-100 backdrop-blur-lg"
          : "bg-transparent"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 py-1 md:py-1.5 transition-all duration-300">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/phoolballoon-logo.jpg"
            alt="Phool & Balloon Logo"
            width={105}
            height={30}
            priority
            className="object-contain md:w-[130px] md:h-auto transition-transform duration-300"
          />
        </Link>

        {/* Right: Links */}
        <div className="flex items-center space-x-3 md:space-x-4">
         <Link
  href="/enquiry"
  className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-[12px] md:text-sm font-medium hover:opacity-90 transition-all"
>
  Enquiry
</Link>

          <Link
            href="/my-orders"
            className="flex items-center gap-1 text-[12px] md:text-sm font-medium text-gray-700 hover:text-teal-600 transition-all"
          >
            <PackageCheck size={13} aria-hidden="true" />
            Orders
          </Link>

          <button className="flex items-center px-3 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white hover:opacity-90 transition text-[11px] md:text-xs font-medium shadow-sm">
            <MapPin size={12} className="mr-1" /> {location}
          </button>
        </div>
      </div>
    </header>
  );
}
