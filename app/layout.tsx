import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import FacebookPixel from "@/components/analytics/MetaPixel";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Longhorn Construction",
  description:
    "Reliable, self-performing construction in Europe, using progressive methods.",
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
      <body className={`${dmSans.variable} ${globalSurface}`}>
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}
