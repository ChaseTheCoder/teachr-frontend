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
      <body>
            <QueryClientProvider client={queryClient}>
        <UserProvider>
          <main>
              <ResponsiveAppBar/>
              {children}
              <Footer/>
              <ReactQueryDevtools />
          </main>
        </UserProvider>
            </QueryClientProvider>
      </body> 
    </html>
  )
}