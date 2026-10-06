import type { Metadata } from "next";
import { Inclusive_Sans } from "next/font/google";
import "./globals.css";

const inclusiveSans = Inclusive_Sans({
  subsets: ["latin"],
  variable: "--font-inclusive-sans",
});

export const metadata: Metadata = { title: "Damien's Place" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inclusiveSans.variable}>
      <body>{children}</body>
    </html>
  );
}
