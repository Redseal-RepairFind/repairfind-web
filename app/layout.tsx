import type { Metadata } from "next";
import "./globals.css";
import { Jost } from "next/font/google";
import LayoutClient from "@/components/ui/client-layout";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost", // creates a CSS variable you can use
});

export const metadata: Metadata = {
  title: "Repairfind Customer",
  description: "Repairfind Customer Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} antialiased flex flex-col items-center`}
      >
        <LayoutClient>{children}</LayoutClient>
        <Toaster
          toastOptions={{
            style: {
              fontFamily: "'Jost', sans-serif",
              fontSize: "12px",
              fontWeight: "700",
            },
            success: {
              iconTheme: {
                primary: "#000000",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
