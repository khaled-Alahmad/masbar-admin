"use client"
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import i18n from '@/i18n';

export default function RootLayout({ children }) {

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
