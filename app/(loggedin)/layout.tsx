'use client'

import React, { useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../services/authenticatedApiCalls';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState(true);
  const { user, error, isLoading: userLoading } = useUser();
  const auth0Id = user?.sub;
  const { data: profileData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })
  useEffect(() => {
    if (!isFetching && !isLoading && user) {
      setProfile(profileData ? true : false)
    }
  }, [isFetching, isLoading, profileData, user])
  
  return (
    <>
      <Stack direction='row'>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <SideNav
            profile={profile}
          />
        </Box>
        <Box sx={{ paddingTop: { xs: '14px', md: '18px'}, paddingX: { xs: '7px', md: '18px'}, width: '100%' }}>
          {children}
        </Box>
      </Stack>
    </>
  )
}