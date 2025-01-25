'use client'

import { UserProvider as Auth0UserProvider } from '@auth0/nextjs-auth0/client';
import React from 'react'
import './globals.css'
import ResponsiveAppBar from '../components/ResponsiveAppBar/ResponsiveAppBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Footer from '../components/footer';
import "react-day-picker/style.css";
import { Box } from '@mui/material';
import Script from 'next/script';
import { UserProvider } from '../context/UserContext';
import { usePathname } from 'next/navigation';
import Head from 'next/head';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour in ms
      refetchOnWindowFocus: false, // Disables automatic refetching when browser window is <focused className=""></focused>
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pathname = usePathname()
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Connect with teachers in the ultimate teacher lounge! Post questions, find solutions, share humor, and upvote the best answers in this supportive social platform for educators." />
        <meta name="keywords" content="teachers, teacher humor, education community, teacher questions, classroom tips, teaching solutions, educators, teacher forum, teacher social network" />
        <meta name="author" content="Teacher Lounge Community" />
        <title>Teacher Lounge - A Solution Oriented & Social Hub for Educators</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
      <body>
        <QueryClientProvider client={queryClient}>
          <Auth0UserProvider>
            <UserProvider>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <main>
                  <ResponsiveAppBar/>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100vw', alignItems: 'center' }}>
                    <Box sx={{ maxWidth: '1550px', width: '100%' }} >
                    {children}
                    </Box>
                  </Box>
                </main>
              </Box>
              <Footer/>
              <ReactQueryDevtools />
            </UserProvider>
          </Auth0UserProvider>
        </QueryClientProvider>
      </body> 
    </html>
  )
}