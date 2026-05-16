"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { reportClientError } from "../../components/ErrorReporter";

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="min-w-[150px] flex-1 sm:min-w-0">
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="h-9 w-full rounded-md border border-pink-100 bg-white px-3 text-sm font-semibold text-gray-800 shadow-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
      >
        {children}
      </select>
    </label>
  );
}

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

  const hasActiveFilters =
    age !== "all" || category !== "all" || theme !== "all" || gender !== "all";

  const resetFilters = () => {
    setAge("all");
    setCategory("all");
    setTheme("all");
    setGender("all");
  };

  if (!isSupportedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100">
        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl rounded-lg border border-pink-100 bg-white/90 px-6 py-10 text-center shadow-xl backdrop-blur-xl">
            <h1 className="mb-3 text-3xl font-black text-gray-900 md:text-5xl">
              Coming Soon!
            </h1>
            <p className="mb-2 text-base text-gray-600 md:text-lg">
              Our <span className="capitalize font-semibold">{type || "design"}</span>{" "}
              collection is on its way.
            </p>
            <p className="font-semibold text-pink-600">
              Stay tuned for exciting designs launching soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cyan-50 text-gray-900">
      <div className="mx-auto max-w-[1400px] px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-3 overflow-hidden rounded-lg border border-pink-100 bg-white shadow-sm">
          <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <div className="mb-1 inline-flex items-center rounded-md bg-pink-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-pink-700">
                {type} collection
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <h1 className="text-2xl font-black capitalize leading-tight text-gray-950 sm:text-3xl">
                  {type} decoration designs
                </h1>
                <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                  {loading ? "Loading..." : `${filteredDesigns.length} found`}
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-600">
                Browse ready decor looks and narrow them quickly by age, category, theme, or
                gender.
              </p>
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 transition hover:border-pink-300 hover:text-pink-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="border-t border-pink-50 bg-pink-50/40 p-2 sm:p-3">
            <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
              <FilterSelect
                label="Age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setCategory("all");
                  setTheme("all");
                  setGender("all");
                }}
              >
                <option value="all">All Ages</option>
                {availableAges.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setTheme("all");
                  setGender("all");
                }}
              >
                <option value="all">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Theme"
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  setGender("all");
                }}
              >
                <option value="all">All Themes</option>
                {availableThemes.map((th) => (
                  <option key={th} value={th}>
                    {th}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="all">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </FilterSelect>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-pink-100 bg-white py-12 text-center text-gray-500 shadow-sm animate-pulse">
            Loading designs...
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="rounded-lg border border-pink-100 bg-white px-4 py-12 text-center shadow-sm">
            <p className="font-bold text-gray-900">No designs found</p>
            <p className="mt-1 text-sm text-gray-600">
              Try clearing filters or choosing a different theme.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
            {filteredDesigns.map((d) => (
              <Link
                key={d.id}
                href={`/event/${type}/${d.id}`}
                className="group overflow-hidden rounded-lg border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={d.image || "/party.jpg"}
                    alt={d.name || "Design"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
                    {d.age ? (
                      <span className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-800 shadow-sm backdrop-blur-md sm:text-[11px]">
                        {d.age}
                      </span>
                    ) : (
                      <span />
                    )}

                    {d.price ? (
                      <span className="rounded-md bg-pink-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm sm:text-[11px]">
                        Rs {d.price}
                      </span>
                    ) : null}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                    <h3 className="line-clamp-2 text-sm font-black leading-tight text-white sm:text-base">
                      {d.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-white/80">
                      {d.theme || d.category || "Decor Design"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 p-2.5 sm:p-3">
                  <div className="flex min-h-6 flex-wrap gap-1.5">
                    {d.category ? (
                      <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-700 sm:text-[11px]">
                        {d.category}
                      </span>
                    ) : null}
                    {d.gender && d.gender !== "all" ? (
                      <span className="rounded-md bg-pink-50 px-2 py-1 text-[10px] font-bold text-pink-700 sm:text-[11px]">
                        {d.gender}
                      </span>
                    ) : null}
                  </div>

                  <p className="line-clamp-2 text-xs leading-5 text-gray-600">
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
