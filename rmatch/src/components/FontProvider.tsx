"use client"; // This makes it a client component

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat", // CSS variable to access in styles
});

export default function FontProvider({ children }) {
  return <div className={montserrat.variable}>{children}</div>;
}
