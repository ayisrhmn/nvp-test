import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import { Providers } from "./providers";
import "@/styles/globals.css";
import dayjs from "dayjs";
import "dayjs/locale/en";

dayjs.locale("en");

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NVP Store - FE Test",
  description: "NVP Store - FE Test",
  icons: {
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
