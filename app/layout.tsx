// Minimal shell: only <html> and <body>. No i18n logic here.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> 
      <body>{children}</body>
    </html>
  );
}
