import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MaapSetu | Legal Metrology Verification Portal",
  description:
    "Government-style portal for online verification, stamping and QR certificates of weighing and measuring instruments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
