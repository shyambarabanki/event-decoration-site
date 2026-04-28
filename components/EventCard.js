"use client";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Next.js Image

export default function EventCard({ title, image, className }) {
  const eventType = title.toLowerCase();
  const isMarriage = eventType === "marriage";

  const hoverGradients = {
    birthday: "from-blue-500 to-blue-400",
    anniversary: "from-yellow-500 to-orange-400",
    marriage: "from-pink-500 to-purple-500",
    "corporate party": "from-gray-600 to-gray-400",
    "any other": "from-green-500 to-green-400",
  };

  const taglines = {
    birthday: "Make memories that sparkle 🎉",
    anniversary: "Celebrate love in style ❤️",
    "corporate party": "Where work meets celebration 🥂",
    "any other": "Your moments, our magic ✨",
  };

  const hoverGradient = hoverGradients[eventType] || hoverGradients.birthday;
  const tagline = taglines[eventType] || "";

  return (
    <div
      className={`relative block ${className} cursor-pointer group rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-500 bg-white`}
    >
      {/* Image */}
      <Link href={`/event/${eventType}`}>
        <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-t-2xl relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-col justify-center p-3 text-center">
        {/* Event Name (Fixed) */}
        <h3
          className={`font-extrabold tracking-wide text-lg sm:text-xl md:text-2xl bg-gradient-to-r ${hoverGradient} bg-clip-text text-transparent`}
        >
          {title}
        </h3>

        {/* Marriage buttons */}
        {isMarriage ? (
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs sm:text-sm">
            {[
              { label: "Pre-Wedding", href: "/event/marriage/pre-wedding" },
              { label: "Wedding", href: "/event/marriage/wedding" },
              { label: "Post-Wedding", href: "/event/marriage/post-wedding" },
            ].map((ceremony, i) => (
              <Link
                key={i}
                href={ceremony.href}
                className={`px-2 py-1 rounded-lg text-center font-semibold text-white backdrop-blur-md hover:shadow-md hover:scale-105 transition-all duration-300 bg-gradient-to-r ${hoverGradient}`}
              >
                {ceremony.label}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs sm:text-sm text-gray-700 font-medium italic overflow-x-auto whitespace-nowrap sm:whitespace-normal animate-marquee">
            {tagline}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
