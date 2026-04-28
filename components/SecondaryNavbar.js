"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBirthdayCake,
  FaHeart,
  FaRing,
  FaBriefcase,
  FaRegSmile,
} from "react-icons/fa";

export default function SecondaryNavbar({ events }) {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const eventStyles = {
    Birthday: { icon: <FaBirthdayCake size={22} />, label: "Birthday" },
    Anniversary: { icon: <FaHeart size={22} />, label: "Anniversary" },
    Marriage: { icon: <FaRing size={22} />, label: "Marriage" },
    "Corporate Party": { icon: <FaBriefcase size={22} />, label: "Corporate" },
    "Any Other": { icon: <FaRegSmile size={22} />, label: "Other" },
  };

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShow(!(currentScroll > lastScrollY && currentScroll > 80));
      setLastScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-[40px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-1.5 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex gap-1.5 sm:gap-4 px-2 sm:px-8 overflow-x-auto scrollbar-hide justify-start sm:justify-center">
        {events.map((event, i) => {
          const style = eventStyles[event.title] || eventStyles["Any Other"];
          const eventType = event.title.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link
              key={i}
              href={`/event/${eventType}`}
              className="flex flex-col items-center justify-center min-w-[64px] w-16 sm:w-20 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all group"
              title={event.title}
            >
              <div className="flex items-center justify-center mb-0.5 w-9 h-9 rounded-md bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 group-hover:scale-105 transition-transform shadow-sm">
                {style.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight mt-0.5">
                {style.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
