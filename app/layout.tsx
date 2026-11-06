import type { Metadata } from "next";
import "./globals.css";
import { ReadingLogProvider } from "@/context/ReadingLogContext";

export const metadata: Metadata = {
  title: "ReadLog",
  description: "Track your personal reading sessions with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ReadingLogProvider>{children}</ReadingLogProvider>
      </body>
    </html>
  );
}
