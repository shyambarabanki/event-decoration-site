import "./globals.css";
import Navbar from "../../components/Navbar";
import SecondaryNavbar from "../../components/SecondaryNavbar";
import Footer from "../../components/Footer";
import Head from "next/head";
import ErrorReporter from "./components/ErrorReporter";

export const metadata = {
  title: "Phool & Balloon - Event Decoration",
  description: "World-class balloon & floral decoration services",
};

export default function RootLayout({ children }) {
  const events = [
    { title: "New Baby", image: "/Baby_Shower_Carousel.jpg" },
    { title: "Birthday", image: "/birthday.jpg" },
    { title: "Anniversary", image: "/anniversary.jpg" },
    { title: "Marriage", image: "/marriage.jpg" },
    { title: "Corporate Party", image: "/corporate.jpg" },
    { title: "Any Other", image: "/party.jpg" },
  ];

  return (
    <html lang="en">
      <Head>
        {/* ✅ Brand-matching theme colors */}
        <meta name="theme-color" content="#25b4aa" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>

      <body className="bg-gray-50 overflow-x-hidden scroll-smooth antialiased">
        <ErrorReporter />

        {/* ✅ Global Navbar (fixed at top) */}
        <Navbar />

        {/* ✅ Secondary Navbar directly below the main navbar */}
        <div className="fixed top-[40px] md:top-[46px] w-full z-40">
          <SecondaryNavbar events={events} />
        </div>

        {/* ✅ Page content area — pushed below both navbars */}
        <main className="relative pt-[85px] md:pt-[95px] pb-12 min-h-screen">
          {children}
        </main>

        {/* ✅ Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
