import type { Metadata } from "next";
import "./globals.css";

import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
// then on <body className={`${dmSans.variable} surface-light`}>…

export const metadata: Metadata = {
  title: "CÉU Construction",
  description:
    "Reliable, self-performing construction in the Algarve using innovative methods like Sismo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * SURFACE DECISION (GLOBAL DEFAULT)
   * Pick exactly one:
   *  - "surface-light" => ice white content pages
   *  - "surface-dark"  => deep navy content pages
   *
   * Any nested wrapper (e.g., in app/[locale]/layout.tsx) can override this for its subtree.
   */
  const globalSurface = "surface-light"; // change to "surface-dark" if you prefer a dark site baseline

  return (
    <html lang="en">
      {/* Add font variables here if using next/font:
          className={`${inter.variable} ${interTight.variable}`} */}
      <body className={`${dmSans.variable} ${globalSurface}`}>
        {children}
      </body>
    </html>
  );
}
