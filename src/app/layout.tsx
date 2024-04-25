import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import ReduxProvider from "@/template/redux-provider";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import dayjs from "dayjs";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
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
        <Providers>
          <ReduxProvider>
            <Layout>{children}</Layout>
            <ToastContainer />
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
