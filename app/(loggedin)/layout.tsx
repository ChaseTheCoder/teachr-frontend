'use client'

import React from 'react'
import { Box, Stack } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';
import BottomMobileNav from '../../components/bottomMobileNav.tsx/bottomMobileNav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  
  return (
    <>
      <Stack direction='row'>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <SideNav/>
        </Box>
        <Box sx={{ paddingTop: { xs: '14px', md: '18px'}, paddingX: { xs: 0, md: '18px'}, width: '100%' }}>
          {children}
        </Box>
      </Stack>
      <BottomMobileNav />
    </>
  )
}