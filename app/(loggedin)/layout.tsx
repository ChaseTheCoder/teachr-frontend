'use client'

import React, { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Grid, Stack } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';
import { getData, getDataNoUserId, getSessionId } from '../../services/authenticatedApiCalls';
import RegisterPage from './register/page';
import { useQuery } from '@tanstack/react-query';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, error, isLoading: userLoading } = useUser();
  const [userIdEncode, setUserIdEncode] = React.useState<string | null>(null);
  useEffect(() => {
    if(!userLoading && user?.sub) {
      setUserIdEncode(encodeURIComponent(user.sub))
    };  
  }, [user, userLoading]);
  const { data: profileData, isFetching, isLoading } = useQuery({
    enabled: !!userIdEncode,
    queryKey: ['profile'],
    queryFn: () => getDataNoUserId(`https://teachr-backend.onrender.com/userprofile/profile/${userIdEncode}/`),
    staleTime: 1000 * 60 * 60, // 1 hour in ms
  })
  
  return (
    <>
      { 
        (!profileData && !isLoading && !isFetching && !userLoading) ?     
        <Grid container>
          <Grid xs={12} item={true} sx={{ paddingTop: '18px' }}>
            <RegisterPage />
          </Grid> 
        </Grid>:
      
        <Stack
          direction='row'
        >
          <SideNav/>
            <Box sx={{ paddingTop: '18px', paddingX: '18px', width: '100%' }}>
              {children}
            </Box>
        </Stack>
      }
    </>
  )
}