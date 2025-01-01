'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client';
import React from 'react'
import './globals.css'
import ResponsiveAppBar from '../components/ResponsiveAppBar/ResponsiveAppBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Footer from '../components/footer';
import "react-day-picker/style.css";
import { Box } from '@mui/material';
import Script from 'next/script';
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        ></Script>
        <script 
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6866843689498036"
          crossOrigin="anonymous">
        </script>
      </head>
      <body>
            <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <main>
                <ResponsiveAppBar/>
                {children}
            </main>
          </Box>
          <Footer/>
          <ReactQueryDevtools />
        </UserProvider>
            </QueryClientProvider>
      </body> 
    </html>
  )
}