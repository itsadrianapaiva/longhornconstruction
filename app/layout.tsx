import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root layout must render <html>/<body>. Keep it minimal and static.
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
