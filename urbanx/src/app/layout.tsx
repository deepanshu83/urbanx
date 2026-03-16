import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "UrbanX — Premium Urban Fashion",
  description:
    "UrbanX brings you premium urban fashion for the modern generation of India. Bold designs, premium quality, Made in India.",
  keywords: ["urban fashion", "streetwear", "India", "premium clothing", "UrbanX"],
  openGraph: {
    title: "UrbanX — Premium Urban Fashion",
    description: "Define Your Style with UrbanX. Premium Urban Fashion for the Modern Generation.",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
