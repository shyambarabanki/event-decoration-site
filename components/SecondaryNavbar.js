"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBaby,
  FaBabyCarriage,
  FaBirthdayCake,
  FaHeart,
  FaRing,
  FaBriefcase,
  FaGift,
  FaMagic,
  FaMoon,
  FaRegSmile,
  FaStar,
  FaTimes,
} from "react-icons/fa";

function NewBabySymbol() {
  return (
    <span className="relative flex h-7 w-7 items-center justify-center">
      <FaBabyCarriage className="relative z-10 drop-shadow-sm" size={22} />
      <FaStar
        className="absolute -right-1.5 -top-1.5 text-pink-500 drop-shadow-sm"
        size={10}
        aria-hidden="true"
      />
      <FaMoon
        className="absolute -left-1.5 bottom-0 text-amber-500 drop-shadow-sm"
        size={9}
        aria-hidden="true"
      />
      <span className="absolute -right-0.5 bottom-0 h-2 w-2 rounded-full bg-teal-300 ring-2 ring-white" />
    </span>
  );
}

function NewBabyPopup({ onClose }) {
  return (
    <div className="fixed left-3 right-3 top-[98px] z-[65] sm:left-auto sm:right-8 sm:top-[104px] sm:w-[360px]">
      <div className="relative overflow-hidden rounded-xl border border-pink-100 bg-white shadow-2xl shadow-pink-100/70">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-pink-100/80" />
        <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-yellow-100/80" />
        <div className="absolute right-10 top-12 h-12 w-12 rounded-full bg-teal-100/80" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-gray-500 shadow-sm transition hover:bg-pink-50 hover:text-pink-600"
          aria-label="Close new baby preview"
        >
          <FaTimes size={14} aria-hidden="true" />
        </button>

        <div className="relative p-4 pr-11">
          <div className="flex items-start gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 via-pink-100 to-teal-100 text-pink-600 shadow-inner ring-1 ring-white">
              <FaBaby size={26} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-amber-500 shadow-md">
                <FaStar size={12} aria-hidden="true" />
              </span>
            </div>

            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-md bg-pink-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-pink-700">
                <FaMagic size={11} aria-hidden="true" />
                New baby decor
              </p>
              <h3 className="mt-2 text-lg font-black leading-tight text-gray-950">
                Baby welcome with pastel balloons and flowers
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Soft balloon clouds, cradle corners, flower trails, and photo-ready welcome setups.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Cradle", "Pastel", "Photo corner"].map((item) => (
              <span
                key={item}
                className="rounded-md border border-pink-100 bg-white/80 px-2 py-1.5 text-center text-[11px] font-extrabold text-gray-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link
              href="/enquiry"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#ff4f9a] px-3 text-sm font-extrabold text-white shadow-lg shadow-pink-100 transition hover:bg-pink-600"
            >
              <FaGift size={14} aria-hidden="true" />
              Request setup
            </Link>
            <Link
              href="/event/new-baby"
              className="inline-flex h-10 items-center justify-center rounded-md border border-teal-100 bg-teal-50 px-3 text-sm font-extrabold text-teal-800 transition hover:bg-teal-100"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SecondaryNavbar({ events }) {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [babyPopupOpen, setBabyPopupOpen] = useState(false);
  const [babyPopupDismissed, setBabyPopupDismissed] = useState(false);
  const pathname = usePathname();

  const eventStyles = {
    "New Baby": {
      icon: <NewBabySymbol />,
      label: "New Baby",
      gradient: "from-yellow-100 via-pink-100 to-teal-100",
      text: "text-amber-700",
      ring: "ring-pink-200",
      bar: "bg-amber-700",
      active: "bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-50 text-amber-800 ring-1 ring-pink-100",
    },
    Birthday: {
      icon: <FaBirthdayCake size={22} />,
      label: "Birthday",
      gradient: "from-pink-100 via-rose-50 to-fuchsia-100",
      text: "text-pink-600",
      ring: "ring-pink-200",
      bar: "bg-pink-600",
      active: "bg-pink-50 text-pink-700",
    },
    Anniversary: {
      icon: <FaHeart size={22} />,
      label: "Anniversary",
      gradient: "from-rose-100 via-pink-50 to-red-100",
      text: "text-rose-600",
      ring: "ring-rose-200",
      bar: "bg-rose-600",
      active: "bg-rose-50 text-rose-700",
    },
    Marriage: {
      icon: <FaRing size={22} />,
      label: "Marriage",
      gradient: "from-purple-100 via-fuchsia-50 to-amber-100",
      text: "text-purple-700",
      ring: "ring-purple-200",
      bar: "bg-purple-700",
      active: "bg-purple-50 text-purple-700",
    },
    "Corporate Party": {
      icon: <FaBriefcase size={22} />,
      label: "Corporate",
      gradient: "from-sky-100 via-cyan-50 to-teal-100",
      text: "text-sky-700",
      ring: "ring-sky-200",
      bar: "bg-sky-700",
      active: "bg-sky-50 text-sky-700",
    },
    "Any Other": {
      icon: <FaRegSmile size={22} />,
      label: "Other",
      gradient: "from-teal-100 via-emerald-50 to-lime-100",
      text: "text-teal-700",
      ring: "ring-teal-200",
      bar: "bg-teal-700",
      active: "bg-teal-50 text-teal-700",
    },
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

  useEffect(() => {
    if (pathname !== "/event/new-baby") {
      setBabyPopupOpen(false);
      return undefined;
    }

    if (babyPopupDismissed) return undefined;

    const timer = window.setTimeout(() => setBabyPopupOpen(true), 350);
    return () => window.clearTimeout(timer);
  }, [pathname, babyPopupDismissed]);

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
          const isActive = pathname === `/event/${eventType}`;
          const isNewBaby = event.title === "New Baby";

          return (
            <Link
              key={i}
              href={`/event/${eventType}`}
              className={`group relative flex min-w-[66px] flex-col items-center justify-center rounded-md px-1 py-1.5 transition-all duration-200 sm:min-w-[82px] ${
                isActive ? `${style.active} shadow-sm` : "hover:bg-white"
              }`}
              title={event.title}
              onFocus={() => {
                if (isNewBaby) setBabyPopupOpen(true);
              }}
              onMouseEnter={() => {
                if (isNewBaby) setBabyPopupOpen(true);
              }}
            >
              <div
                className={`mb-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br ${style.gradient} ${style.text} shadow-sm ring-1 ${style.ring} transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105 ${
                  isNewBaby ? "group-hover:rotate-[-3deg]" : ""
                }`}
              >
                {style.icon}
              </div>
              <span
                className={`mt-0.5 text-center text-[10px] font-bold leading-tight sm:text-xs ${
                  isActive ? style.text : "text-gray-700"
                }`}
              >
                {style.label}
              </span>
              {isActive ? (
                <span className={`absolute bottom-0 h-0.5 w-8 rounded-full ${style.bar}`} />
              ) : null}
              {isNewBaby ? (
                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
              ) : null}
            </Link>
          );
        })}
      </div>
      {babyPopupOpen ? (
        <NewBabyPopup
          onClose={() => {
            setBabyPopupOpen(false);
            setBabyPopupDismissed(true);
          }}
        />
      ) : null}
    </nav>
  );
}
