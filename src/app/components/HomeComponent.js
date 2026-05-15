"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const occasions = [
  {
    title: "Birthday",
    slug: "birthday",
    image: "/birthday1.jpg",
    badge: "Most booked",
    copy: "Theme decor, balloons, backdrops, lights",
  },
  {
    title: "Anniversary",
    slug: "anniversary",
    image: "/anniversary1.jpg",
    badge: "Romantic sets",
    copy: "Floral corners, candles, photo moments",
  },
  {
    title: "Marriage",
    slug: "marriage",
    image: "/marriage1.jpg",
    badge: "Premium",
    copy: "Haldi, engagement, wedding stage styling",
  },
  {
    title: "Corporate",
    slug: "corporate-party",
    image: "/corporate.jpg",
    badge: "Office ready",
    copy: "Brand-friendly event and party setups",
  },
  {
    title: "Custom Decor",
    slug: "any-other",
    image: "/party.jpg",
    badge: "Flexible",
    copy: "House parties, surprises, themed requests",
  },
];

const packageCards = [
  {
    title: "Birthday Room Makeover",
    href: "/event/birthday",
    image: "/carousel1.jpg",
    price: "Rs 2,999 onward",
    meta: "2-3 hour setup",
    rating: "4.9",
  },
  {
    title: "Floral Anniversary Corner",
    href: "/event/anniversary",
    image: "/carousel2.jpg",
    price: "Rs 3,499 onward",
    meta: "Photo-ready decor",
    rating: "4.8",
  },
  {
    title: "Wedding Entry Styling",
    href: "/event/marriage",
    image: "/carousel4.jpg",
    price: "Custom quote",
    meta: "Premium team",
    rating: "5.0",
  },
  {
    title: "Corporate Celebration Kit",
    href: "/event/corporate-party",
    image: "/carousel3.jpg",
    price: "Rs 4,999 onward",
    meta: "Brand-safe setup",
    rating: "4.7",
  },
];

const serviceHighlights = [
  { icon: Truck, title: "Local setup", text: "Decor team reaches your venue in Lucknow and nearby areas." },
  { icon: ShieldCheck, title: "Verified booking", text: "OTP and booking details keep every request traceable." },
  { icon: Clock3, title: "Fast planning", text: "Choose occasion, slot, pincode, and confirm in minutes." },
];

const quickFilters = [
  { label: "Birthday", href: "/event/birthday" },
  { label: "Balloon arch", href: "/event/any-other" },
  { label: "Flower decor", href: "/event/anniversary" },
  { label: "Wedding stage", href: "/event/marriage" },
  { label: "Office party", href: "/event/corporate-party" },
];

function buildEventHref(slug) {
  return `/event/${slug}`;
}

function OccasionTile({ occasion, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        href={buildEventHref(occasion.slug)}
        className="group block h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={occasion.image}
            alt={occasion.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-gray-900 shadow-sm">
            {occasion.badge}
          </span>
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-950 sm:text-base">{occasion.title}</h3>
            <ArrowRight
              size={16}
              className="shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 min-h-[40px] text-xs leading-5 text-gray-600 sm:text-sm">
            {occasion.copy}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function PackageCard({ item }) {
  return (
    <Link
      href={item.href}
      className="group block min-w-[250px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg sm:min-w-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, 24vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
          <Star size={13} className="fill-amber-400 text-amber-400" aria-hidden="true" />
          {item.rating}
        </div>
        <h3 className="text-base font-bold text-gray-950">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{item.meta}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-extrabold text-teal-700">{item.price}</span>
          <span className="text-xs font-bold text-gray-500 transition group-hover:text-gray-950">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomeComponent() {
  const searchParams = useSearchParams();
  const [showMessage, setShowMessage] = useState(false);
  const primaryOccasions = useMemo(() => occasions.slice(0, 4), []);

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      setShowMessage(true);
      const timer = window.setTimeout(() => setShowMessage(false), 5000);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [searchParams]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf3] pb-20 text-gray-950 sm:pb-0">
      <AnimatePresence>
        {showMessage ? (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-xl"
          >
            Booking successful. We will contact you soon.
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="relative overflow-hidden bg-[#fff2e0] text-gray-950">
        <Image
          src="/carousel3.jpg"
          alt="Colorful balloon and event decoration"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,243,0.98),rgba(255,242,224,0.9),rgba(236,253,245,0.82))]" />

        <div className="relative mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 md:py-7 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex min-h-[430px] min-w-0 flex-col justify-between rounded-lg border border-pink-100 bg-white/85 p-4 shadow-xl shadow-pink-100/50 backdrop-blur-sm sm:p-6 lg:min-h-[520px]"
          >
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-md bg-[#ff4f9a] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">
                  <BadgeCheck size={14} aria-hidden="true" />
                  Decoration marketplace
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                  <MapPin size={14} aria-hidden="true" />
                  Lucknow first
                </span>
              </div>

              <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl">
                Colorful decorations for every celebration.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-700 sm:text-base">
                Browse birthday, anniversary, wedding, and party decor with bright
                themes, real images, service checks, and quick booking.
              </p>

              <div className="mt-6 min-w-0 overflow-hidden rounded-lg bg-white p-2 shadow-2xl shadow-pink-100">
                <div className="flex min-w-0 items-center gap-2 rounded-md border border-pink-100 bg-pink-50/60 px-3 py-2">
                  <Search size={20} className="shrink-0 text-pink-500" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-600">
                    Search decor styles...
                  </span>
                  <Link
                    href="/event/birthday"
                    className="shrink-0 rounded-md bg-[#ff4f9a] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-pink-600"
                  >
                    Browse
                  </Link>
                </div>

                <div className="mt-2 flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
                  {quickFilters.map((filter) => (
                    <Link
                      key={filter.label}
                      href={filter.href}
                      className="shrink-0 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
                    >
                      {filter.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["5+", "Occasions"],
                ["10 min", "Quick request"],
                ["OTP", "Secure flow"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-teal-100 bg-teal-50 p-3">
                  <span className="block text-lg font-black text-teal-800 sm:text-2xl">{value}</span>
                  <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-teal-700/70">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1"
          >
            <Link
              href="/event/marriage"
              className="group relative min-h-[260px] overflow-hidden rounded-lg bg-pink-100 shadow-2xl shadow-pink-100 sm:min-h-[320px] lg:min-h-[360px]"
            >
              <Image
                src="/carousel4.jpg"
                alt="Premium wedding decoration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-950/70 via-pink-900/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="mb-2 inline-flex rounded-md bg-amber-300 px-2.5 py-1 text-xs font-extrabold text-gray-950">
                  Featured setup
                </span>
                <h2 className="text-2xl font-black text-white">Wedding ready decor</h2>
                <p className="mt-1 text-sm text-white/90">Stage, entry, floral and photo zones.</p>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              {primaryOccasions.slice(0, 2).map((item) => (
                <Link
                  href={buildEventHref(item.slug)}
                  key={item.slug}
                  className="group relative min-h-[150px] overflow-hidden rounded-lg bg-amber-100"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 22vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/65 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 text-sm font-black text-white">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {serviceHighlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 py-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-gray-950">{title}</span>
                <span className="mt-1 block text-sm leading-5 text-gray-600">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-teal-700">
              Shop by occasion
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
              Choose your event category
            </h2>
          </div>
          <Link
            href="/event/birthday"
            className="hidden rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-800 transition hover:border-teal-400 hover:text-teal-700 sm:inline-flex"
          >
            View catalog
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {occasions.map((occasion, index) => (
            <OccasionTile key={occasion.slug} occasion={occasion} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-[#fff5f7] py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-amber-700">
                Popular packages
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                Frequently booked setups
              </h2>
            </div>
            <span className="hidden items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 sm:inline-flex">
              <Sparkles size={15} aria-hidden="true" />
              Slots fill quickly
            </span>
          </div>

          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {packageCards.map((item) => (
              <PackageCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-lg border border-pink-100 bg-white p-5 text-gray-950 shadow-lg shadow-pink-100/60 sm:grid-cols-3 sm:p-6">
          {[
            { icon: Search, title: "Browse", text: "Pick the occasion and style that fits your event." },
            { icon: CalendarCheck, title: "Schedule", text: "Select pincode, date, time, and verify your mobile." },
            { icon: Gift, title: "Celebrate", text: "Our team confirms details and prepares the setup." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-200 text-amber-900">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-black">{title}</span>
                <span className="mt-1 block text-sm leading-6 text-gray-600">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-950">
              Need something custom?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Share the occasion and budget. We will help shape the decor plan.
            </p>
          </div>
          <Link
            href="/enquiry"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#ff4f9a] px-5 text-sm font-extrabold text-white shadow-lg shadow-pink-100 transition hover:bg-pink-600"
          >
            Send enquiry
            <CheckCircle2 size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
