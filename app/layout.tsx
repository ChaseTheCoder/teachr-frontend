'use client'

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { getAccessToken } from '@auth0/nextjs-auth0';
import React from 'react'
import './globals.css'
import ResponsiveAppBar from '../components/TopNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // async function getToken() {
  //   try {
  //     const { accessToken } = await getAccessToken();
  //     console.log(accessToken);
  //   } catch {
  //     console.log('error')
  //   }
  // }
  // getToken();
  return (
    <html lang="en">
      <UserProvider>  
        <body>
          <main>
            <ResponsiveAppBar/>
            {children}
          </main>
        </body>
      </UserProvider>
    </html>
  )
}