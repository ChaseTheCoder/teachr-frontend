'use client'

import React from 'react'
import { Box, Stack } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
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