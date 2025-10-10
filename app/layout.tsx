import type { Metadata } from "next";
import "./globals.css";

// If you’re using next/font, bind fonts here and expose CSS vars:
// import { Inter, Inter_Tight } from "next/font/google";
// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-heading" });

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
      <body className={globalSurface}>
        {/* Optional: accessible skip link */}
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
