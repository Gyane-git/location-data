import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nepal Administrative Data",
  description: "Province, district, municipality, and ward dataset for Nepal",
  icons: {
    icon: "/devminlogo.png",
    shortcut: "/devminlogo.png",
    apple: "/devminlogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
