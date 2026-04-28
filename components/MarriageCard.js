import Link from "next/link";

export default function MarriageCard({ title, image, className }) {
  const ceremonies = [
    { name: "Pre-Wedding", color: "from-yellow-400 to-orange-500" },
    { name: "Wedding", color: "from-pink-500 to-red-500" },
    { name: "Post-Wedding", color: "from-purple-500 to-indigo-600" },
  ];

  return (
    <Link
      href={`/event/${title.toLowerCase()}`}
      className={`relative block overflow-hidden rounded-2xl shadow-xl group ${className}`}
    >
      {/* Background Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40 rounded-2xl" />
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 text-white">
        <h3 className="text-2xl font-extrabold drop-shadow-md">
          {title} Ceremony
        </h3>
        <p className="text-sm opacity-90">A Journey of Love</p>
      </div>

      {/* Ceremonies - stacked inside the card */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex flex-col gap-2">
        {ceremonies.map((c, i) => (
          <div
            key={i}
            className={`w-full text-center py-2 rounded-xl bg-gradient-to-r ${c.color} text-white font-semibold shadow-md transform group-hover:scale-[1.02] transition`}
          >
            {c.name}
          </div>
        ))}
      </div>
    </Link>
  );
}
