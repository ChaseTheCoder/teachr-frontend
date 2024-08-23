'use client'

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Grid } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, error, isLoading } = useUser();
  return (
    <>
      { user &&
        <Grid container>
          <Grid xs={1} item={true} sx={{ paddingTop: '18px' }}>
            <SideNav/>
          </Grid>
          <Grid xs={11} item={true}>
            <Box sx={{ paddingTop: '18px', paddingX: '18px' }}>
              {children}
            </Box>
          </Grid>
        </Grid>
      }
    </>
)
}
