"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";

export default function EventDetails() {
  const params = useParams();
  const type = params?.type || "";

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [age, setAge] = useState("all");
  const [gender, setGender] = useState("all");
  const [theme, setTheme] = useState("all");

  // Fetch designs from API
  useEffect(() => {
    if (!type) return;

    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.phoolandbaloon.com/api/designs/${type}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setDesigns(data || []);
      } catch (err) {
        console.error("Error fetching designs:", err);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [type]);

  // ✅ Client-side Filtering (case-insensitive)
  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      const matchAge = age === "all" || (d.age && d.age.toLowerCase() === age.toLowerCase());
      const matchGender =
        gender === "all" ||
        (d.gender && d.gender.toLowerCase() === gender.toLowerCase()) ||
        d.gender === "all";
      const matchTheme =
        theme === "all" || (d.theme && d.theme.toLowerCase() === theme.toLowerCase());

      return matchAge && matchGender && matchTheme;
    });
  }, [designs, age, gender, theme]);

  return (
    <div>
      <Navbar />
      <div className="pt-28 p-4 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 capitalize">{type} Designs</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">All Ages</option>
            <option value="kids">Kids (1–12 years)</option>
            <option value="teenagers">Teenagers (13–19 years)</option>
            <option value="adult">Adults (20+)</option>
          </select>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border rounded-xl p-2 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">All Themes</option>
            <option value="balloon">Balloon</option>
            <option value="cartoon Characters">Cartoon Characters</option>
            <option value="elegant">Elegant</option>
            <option value="romantic">Romantic</option>
            <option value="flower">Flower</option>
            <option value="traditional">Traditional</option>
            <option value="modern">Modern</option>
            <option value="superheroes">Superheroes</option>
            <option value="corporate">Corporate</option>
            <option value="fun">Fun</option>
          </select>
        </div>

        {/* Designs Grid */}
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
