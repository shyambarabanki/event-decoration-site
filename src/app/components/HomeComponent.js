"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Gift,
  MapPin,
  Search,
  Sparkles,
  Star,
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
    image: "/anniversary_carousel.jpg",
    price: "Rs 3,499 onward",
    meta: "Photo-ready decor",
    rating: "4.8",
  },
  {
    title: "Wedding Entry Styling",
    href: "/event/marriage",
    image: "/marriage1.jpg",
    price: "Custom quote",
    meta: "Premium team",
    rating: "5.0",
  },
  {
    title: "Corporate Celebration Kit",
    href: "/event/corporate-party",
    image: "/corporate.jpg",
    price: "Rs 4,999 onward",
    meta: "Brand-safe setup",
    rating: "4.7",
  },
];

const heroSlides = [
  {
    title: "Joyful birthday balloon decor",
    subtitle: "Colorful balloon walls, theme backdrops, table styling, and photo-ready corners.",
    image: "/carousel1.jpg",
    href: "/event/birthday",
    badge: "Birthday decor",
    badgeClass: "bg-pink-50/95 text-pink-700 ring-pink-200",
    dotClass: "bg-pink-600",
  },
  {
    title: "Elegant anniversary floral setup",
    subtitle: "Soft flowers, heart balloons, warm backdrops, and a polished romantic finish.",
    image: "/anniversary_carousel.jpg",
    href: "/event/anniversary",
    badge: "Anniversary",
    badgeClass: "bg-fuchsia-50/95 text-fuchsia-700 ring-fuchsia-200",
    dotClass: "bg-fuchsia-600",
  },
  {
    title: "Beautiful baby shower decoration",
    subtitle: "Gentle colors, balloon styling, themed backdrops, and picture-perfect details.",
    image: "/Baby_Shower_Carousel.jpg",
    href: "/event/any-other",
    badge: "Baby shower",
    badgeClass: "bg-violet-50/95 text-violet-700 ring-violet-200",
    dotClass: "bg-violet-600",
  },
  {
    title: "Fresh phool decor styling",
    subtitle: "Real flower-inspired styling, graceful backdrops, and elegant event detailing.",
    image: "/Phool_carousal.jpg",
    href: "/event/anniversary",
    badge: "Phool decor",
    badgeClass: "bg-yellow-50/95 text-yellow-700 ring-yellow-200",
    dotClass: "bg-yellow-400",
  },
  {
    title: "Romantic surprise proposal decor",
    subtitle: "Premium flowers, soft lighting, heart details, and a memorable proposal setup.",
    image: "/Surprise_Proposa_Romantic_Setup_Carousel.jpg",
    href: "/event/anniversary",
    badge: "Proposal setup",
    badgeClass: "bg-rose-50/95 text-rose-700 ring-rose-200",
    dotClass: "bg-rose-600",
  },
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
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlide = heroSlides[currentHeroSlide];

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      setShowMessage(true);
      const timer = window.setTimeout(() => setShowMessage(false), 5000);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentHeroSlide((slide) => (slide + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const showPreviousSlide = () => {
    setCurrentHeroSlide((slide) => (slide - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNextSlide = () => {
    setCurrentHeroSlide((slide) => (slide + 1) % heroSlides.length);
  };

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

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#fff7fb_45%,#ecfeff_100%)] pt-3 text-gray-950 sm:pt-0">
        <div className="relative mx-auto grid max-w-[96rem] grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-stretch gap-1.5 px-2 py-2 sm:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] sm:gap-3 sm:px-6 sm:py-3 md:py-5 lg:grid-cols-[6rem_minmax(0,1fr)_6rem] lg:px-8 xl:grid-cols-[7rem_minmax(0,1fr)_7rem]">
          <div className="pointer-events-none">
            <div className="relative h-full min-h-[120px] overflow-hidden rounded-lg border border-yellow-100 bg-white shadow-xl shadow-yellow-100 sm:min-h-[190px] lg:min-h-[245px]">
              <Image
                src="/Phool.jpg"
                alt=""
                fill
                sizes="128px"
                aria-hidden="true"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-950/80 via-yellow-700/15 to-white/5" />
              <div className="absolute inset-x-0 bottom-2 text-center sm:bottom-3 xl:bottom-5">
                <span className="block text-xl font-black leading-none text-yellow-300 drop-shadow-lg sm:text-3xl xl:text-5xl">
                  P
                </span>
                <span className="mt-0.5 block text-[7px] font-extrabold uppercase tracking-wide text-yellow-100 drop-shadow sm:text-[10px] xl:mt-1 xl:text-xs">
                  Phool
                </span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="min-w-0 overflow-hidden rounded-lg border border-pink-100 bg-white shadow-2xl shadow-pink-100/60"
          >
            <div className="relative aspect-[16/8.5] overflow-hidden bg-gray-950 sm:aspect-[16/7] lg:aspect-[16/6]">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.image}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentHeroSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    aria-hidden="true"
                    className="scale-110 object-cover opacity-50 blur-xl"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute inset-1 sm:inset-3">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/45 to-transparent" />

              <div className="absolute left-1.5 top-1.5 sm:left-5 sm:top-5">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ring-1 shadow-sm sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${heroSlide.badgeClass}`}
                >
                  <BadgeCheck size={10} aria-hidden="true" />
                  {heroSlide.badge}
                </span>
              </div>

              <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 justify-between gap-3 sm:left-5 sm:right-5">
                <button
                  type="button"
                  onClick={showPreviousSlide}
                  aria-label="Previous decoration slide"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-gray-950 shadow-sm transition hover:bg-white sm:h-10 sm:w-10"
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNextSlide}
                  aria-label="Next decoration slide"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-gray-950 shadow-sm transition hover:bg-white sm:h-10 sm:w-10"
                >
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>

              <div className="absolute bottom-1 left-1 w-fit max-w-[8.5rem] sm:bottom-4 sm:left-4 sm:max-w-xs lg:max-w-sm">
                <div className="flex w-fit max-w-full min-w-0 flex-col gap-1 rounded-md bg-black/30 p-1 text-white shadow-lg backdrop-blur-sm sm:gap-1.5 sm:p-2.5">
                  <h1 className="truncate text-[10px] font-black leading-tight sm:text-sm lg:text-lg">
                    {heroSlide.title}
                  </h1>
                  <p className="hidden max-w-xs text-xs leading-5 text-white/90 lg:block">
                    {heroSlide.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={heroSlide.href}
                      className="inline-flex h-6 items-center justify-center gap-1 rounded-md bg-[#ff4f9a] px-2 text-[9px] font-extrabold text-white shadow-lg shadow-black/20 transition hover:bg-pink-600 sm:h-7 sm:px-2.5 sm:text-[11px]"
                    >
                      Explore
                      <ArrowRight size={10} aria-hidden="true" />
                    </Link>
                    <span className="hidden h-7 items-center gap-1 rounded-md border border-cyan-100 bg-white/95 px-2 text-[10px] font-extrabold text-gray-900 shadow-sm min-[420px]:inline-flex sm:text-[11px]">
                      <MapPin size={11} className="text-teal-700" aria-hidden="true" />
                      <span className="whitespace-nowrap">
                        Live in <span className="text-pink-600">Noida</span> &{" "}
                        <span className="text-teal-700">Lucknow</span>
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-1 flex justify-center gap-1 sm:mt-3 sm:gap-2">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setCurrentHeroSlide(index)}
                      aria-label={`Show ${slide.badge}`}
                      className={`h-1.5 rounded-full shadow-sm transition-all sm:h-2.5 ${
                        index === currentHeroSlide
                          ? `w-5 sm:w-8 ${slide.dotClass}`
                          : "w-1.5 bg-white/70 hover:bg-white sm:w-2.5"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="pointer-events-none">
            <div className="relative h-full min-h-[120px] overflow-hidden rounded-lg border border-pink-100 bg-white shadow-xl shadow-pink-100 sm:min-h-[190px] lg:min-h-[245px]">
              <Image
                src="/Balloon.jpg"
                alt=""
                fill
                sizes="128px"
                aria-hidden="true"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-pink-700/15 to-white/5" />
              <div className="absolute inset-x-0 bottom-2 text-center sm:bottom-3 xl:bottom-5">
                <span className="block text-xl font-black leading-none text-pink-300 drop-shadow-lg sm:text-3xl xl:text-5xl">
                  B
                </span>
                <span className="mt-0.5 block text-[7px] font-extrabold uppercase tracking-wide text-pink-100 drop-shadow sm:text-[10px] xl:mt-1 xl:text-xs">
                  Balloon
                </span>
              </div>
            </div>
          </div>
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
