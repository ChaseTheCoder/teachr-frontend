'use client'

import React, { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Grid } from '@mui/material'
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
    if(!userLoading && user !== undefined) {
      setUserIdEncode(encodeURIComponent(user.sub))
    };
  }, [user, userLoading]);
  const { data: profileData, isFetching, isLoading } = useQuery({
    enabled: userIdEncode !== null,
    queryKey: ['profile'],
    queryFn: () => getDataNoUserId(`http://localhost:8000/userprofile/profile/${userIdEncode}/`),
    staleTime: 1000 * 60 * 60, // 1 hour in ms
    refetchOnWindowFocus: false,
  })
  
  if(isLoading) return <div>Loading...</div>
  
  return (
    <Grid container>
      { user &&
        <>
          <Grid xs={1} item={true} sx={{ paddingTop: '18px' }}>
            <SideNav/>
          </Grid>
          <Grid xs={11} item={true}>
            <Box sx={{ paddingTop: '18px', paddingX: '18px' }}>
              {children}
            </Box>
          </Grid>
        </>
      }
      { user && !profileData && !isLoading && !isFetching &&     
        <Grid xs={12} item={true} sx={{ paddingTop: '18px' }}>
          <RegisterPage />
        </Grid>
      }
    </Grid>
)
}
