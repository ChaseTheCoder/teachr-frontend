'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client';
import React from 'react'
import './globals.css'
import ResponsiveAppBar from '../components/TopNav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Footer from '../components/footer';
import "react-day-picker/style.css";
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html, body {
            height: 100%;
            margin: 0;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          main {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </head>
      <body>
            <QueryClientProvider client={queryClient}>
        <UserProvider>
          <div id="__next">
            <main>
                <ResponsiveAppBar/>
                {children}
            </main>
          </div>
          <Footer/>
          <ReactQueryDevtools />
        </UserProvider>
            </QueryClientProvider>
      </body> 
    </html>
  )
}