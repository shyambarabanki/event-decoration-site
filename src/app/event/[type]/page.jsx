"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { reportClientError } from "../../components/ErrorReporter";

export default function EventDetails() {
  const params = useParams();
  const type = params?.type?.toLowerCase() || "";

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [age, setAge] = useState("all");
  const [category, setCategory] = useState("all");
  const [theme, setTheme] = useState("all");
  const [gender, setGender] = useState("all");

  const isSupportedType = type === "birthday" || type === "anniversary";

  useEffect(() => {
    if (!type || !isSupportedType) {
      setLoading(false);
      return;
    }

    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/designs/${type}`);
        const data = await res.json();
        setDesigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        reportClientError("event-list/fetch-designs", err, { type });
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [type, isSupportedType]);

  const availableAges = useMemo(() => {
    const uniqueAges = [...new Set(designs.map((d) => d.age?.trim()).filter(Boolean))];
    return uniqueAges.sort((a, b) => a.localeCompare(b));
  }, [designs]);

  const availableCategories = useMemo(() => {
    let filtered = designs;

    if (age !== "all") {
      filtered = filtered.filter((d) => d.age?.toLowerCase() === age.toLowerCase());
    }

    const uniqueCategories = [...new Set(filtered.map((d) => d.category?.trim()).filter(Boolean))];
    return uniqueCategories.sort((a, b) => a.localeCompare(b));
  }, [designs, age]);

  const availableThemes = useMemo(() => {
    let filtered = designs;

    if (age !== "all") {
      filtered = filtered.filter((d) => d.age?.toLowerCase() === age.toLowerCase());
    }

    if (category !== "all") {
      filtered = filtered.filter((d) => d.category?.toLowerCase() === category.toLowerCase());
    }

    const uniqueThemes = [...new Set(filtered.map((d) => d.theme?.trim()).filter(Boolean))];
    return uniqueThemes.sort((a, b) => a.localeCompare(b));
  }, [designs, age, category]);

  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      const matchAge = age === "all" || d.age?.toLowerCase() === age.toLowerCase();
      const matchCategory =
        category === "all" || d.category?.toLowerCase() === category.toLowerCase();
      const matchTheme = theme === "all" || d.theme?.toLowerCase() === theme.toLowerCase();
      const matchGender =
        gender === "all" ||
        d.gender?.toLowerCase() === gender.toLowerCase() ||
        d.gender === "all";

      return matchAge && matchCategory && matchTheme && matchGender;
    });
  }, [designs, age, category, theme, gender]);

  if (!isSupportedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100">
        <Navbar />
        <div className="pt-24 px-4 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-xl border border-pink-100 px-6 py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Coming Soon!
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-2">
              Our <span className="capitalize font-semibold">{type || "design"}</span> collection is on its way.
            </p>
            <p className="text-pink-600 font-semibold">
              Stay tuned for exciting designs launching soon 🚀
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 text-gray-900">
      <Navbar />

      <div className="pt-20 pb-10 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold tracking-wide mb-2">
              {type.toUpperCase()} COLLECTION
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              {type} Designs
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl text-sm md:text-base">
              Explore curated decoration concepts and filter by age, category, theme, and gender.
            </p>
          </div>

          <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm w-fit">
            {loading ? "Loading..." : `${filteredDesigns.length} design(s) found`}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-[1.5rem] bg-white/90 backdrop-blur-xl border border-pink-100 shadow-lg p-3 md:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <select
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setCategory("all");
                setTheme("all");
                setGender("all");
              }}
              className="h-11 border border-pink-200 rounded-2xl px-4 bg-pink-50/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All Ages</option>
              {availableAges.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setTheme("all");
                setGender("all");
              }}
              className="h-11 border border-pink-200 rounded-2xl px-4 bg-pink-50/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                setGender("all");
              }}
              className="h-11 border border-pink-200 rounded-2xl px-4 bg-pink-50/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All Themes</option>
              {availableThemes.map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="h-11 border border-pink-200 rounded-2xl px-4 bg-pink-50/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="py-12 text-center text-gray-500 animate-pulse">
            Loading designs...
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-2">🔎</div>
            <p className="text-gray-600">No designs found for the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
            {filteredDesigns.map((d) => (
              <Link
                key={d.id}
                href={`/event/${type}/${d.id}`}
                className="group overflow-hidden rounded-[1.3rem] bg-white shadow-md border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={d.image || "/placeholder.png"}
                    alt={d.name || "Design"}
                    className="w-full h-44 md:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    {d.age ? (
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-gray-800 shadow-sm">
                        {d.age}
                      </span>
                    ) : (
                      <span />
                    )}

                    {d.price ? (
                      <span className="px-2.5 py-1 rounded-full bg-pink-500 text-white text-[11px] font-semibold shadow-sm">
                        ₹{d.price}
                      </span>
                    ) : null}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-base md:text-lg font-bold leading-tight line-clamp-2">
                      {d.name}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm mt-1 line-clamp-1">
                      {d.theme || d.category || "Decor Design"}
                    </p>
                  </div>
                </div>

                <div className="p-3 md:p-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {d.category ? (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                        {d.category}
                      </span>
                    ) : null}
                    {d.gender && d.gender !== "all" ? (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-pink-50 text-pink-700">
                        {d.gender}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                    {d.description ||
                      "A beautiful decoration concept crafted for memorable celebrations."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
