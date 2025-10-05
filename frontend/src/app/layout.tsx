import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Will It Rain On My Parade?",
  description: "Check weather suitability using NASA data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}