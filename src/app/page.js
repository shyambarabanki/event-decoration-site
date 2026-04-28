"use client";

import dynamic from "next/dynamic";

const HomeComponent = dynamic(() => import("./components/HomeComponent"), { ssr: false });

export default function Page() {
  return <HomeComponent />;
}
