'use client'

import React from 'react'
import { Box, Stack } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser();
  console.log(user);
  
  return (
    <>
      <Stack
        direction='row'
      >
        <SideNav/>
          <Box sx={{ paddingTop: '18px', paddingX: '18px', width: '100%' }}>
            {children}
          </Box>
      </Stack>
    </>
  )
}