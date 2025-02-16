"use client"
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import i18n from '@/i18n';
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <html lang="en">
      <head>

        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <Toaster position="top-right" reverseOrder={false} />


          {children}

        </NextUIProvider>
      </body>
    </html >
  );
}
