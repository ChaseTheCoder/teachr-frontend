'use client'

import React from 'react'
import { Box, Button, Stack } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation'
import BottomMobileNav from '../../components/bottomMobileNav.tsx/bottomMobileNav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const router = useRouter()
  // const { user, error, isLoading } = useUser();
  // const auth0Id = user?.sub;

  // if(error) {
  //   return <div>{error.message}</div>
  // }
  
  
  return (
    <>
      <Stack direction='row'>
        {/* { !user && !isLoading ?
          <Button
            color='success'
          >
            <a href='/api/auth/login'>
              Log In
            </a>
          </Button> : */}
          <>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <SideNav/>
            </Box>
            <Box sx={{ paddingTop: { xs: '14px', md: '18px'}, paddingX: { xs: '7px', md: '18px'}, width: '100%' }}>
              {children}
            </Box>
          </>
        {/* } */}
      </Stack>
      <BottomMobileNav />
    </>
  )
}