"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";

export default function EventDetails() {
  const params = useParams();
  const type = params?.type?.toLowerCase() || ""; // normalize lowercase

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [age, setAge] = useState("all");
  const [gender, setGender] = useState("all");
  const [theme, setTheme] = useState("all");

  // Fetch designs only if type === "birthday"
  useEffect(() => {
    if (!type || type !== "birthday") {
      setLoading(false);
      return;
    }

    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.phoolandbaloon.com/api/designs/${type}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setDesigns(data || []);
      } catch (err) {
        console.error(err);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [type]);

  // ✅ Get distinct dynamic age values
  const availableAges = useMemo(() => {
    const uniqueAges = [...new Set(designs.map((d) => d.age?.trim()).filter(Boolean))];
    return uniqueAges.sort((a, b) => a.localeCompare(b));
  }, [designs]);

  // ✅ Get distinct dynamic theme values based on selected age
  const availableThemes = useMemo(() => {
    let filtered = designs;
    if (age !== "all") {
      filtered = filtered.filter((d) => d.age?.toLowerCase() === age.toLowerCase());
    }
    const uniqueThemes = [...new Set(filtered.map((d) => d.theme?.trim()).filter(Boolean))];
    return uniqueThemes.sort((a, b) => a.localeCompare(b));
  }, [designs, age]);

  // ✅ Apply filters
  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      const matchAge = age === "all" || d.age?.toLowerCase() === age.toLowerCase();
      const matchGender =
        gender === "all" ||
        d.gender?.toLowerCase() === gender.toLowerCase() ||
        d.gender === "all";
      const matchTheme = theme === "all" || d.theme?.toLowerCase() === theme.toLowerCase();
      return matchAge && matchGender && matchTheme;
    });
  }, [designs, age, gender, theme]);

  // 🟡 Coming Soon Screen for non-birthday types
  if (type !== "birthday" && type !== "anniversary") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-purple-200 text-center">
        <Navbar />
        <div className="absolute top-1/2 transform -translate-y-1/2">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🎉 Coming Soon!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Our <span className="capitalize">{type}</span> decoration collection is on its way.
          </p>
          <p className="text-pink-500 font-semibold">
            Stay tuned for exciting designs launching soon 🚀
          </p>
        </div>
      </div>
    );
  }

  // 🎂 Birthday Designs Page
  return (
    <div>
      <Navbar />
      <div className="pt-28 p-4 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 capitalize">{type} Designs</h1>

        {/* 🔽 Filters Section */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          {/* 🧒 Age Filter (Dynamic) */}
          <select
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setTheme("all"); // reset theme when age changes
            }}
            className="border rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">All Ages</option>
            {availableAges.map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>

          {/* 🚻 Gender Filter */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* 🎨 Theme Filter (Dynamic) */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">All Themes</option>
            {availableThemes.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>

        {/* 💎 Designs Grid */}
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading designs...</p>
        ) : filteredDesigns.length === 0 ? (
          <p className="text-gray-500">No designs found for the selected filters.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredDesigns.map((d) => (
              <Link
                key={d.id}
                href={`/event/${type}/${d.id}`}
                className="cursor-pointer group rounded-2xl bg-white border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-40 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-3">
                  <h3 className="font-bold">{d.name}</h3>
                  <p className="text-gray-600">Price: ₹{d.price}</p>
                  <p className="text-gray-500 text-sm truncate">{d.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
