'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../../services/authenticatedApiCalls';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import EditIcon from '@mui/icons-material/Edit';
import Activity from './activity';
import EditProfile from './editProfile';
import ProfileInformation from './profileInformation';

export default function Profile() {
  const [sectionSelected, setSectionSelected] = useState('activity');
  const { user, error, isLoading: isLoadingUser } = useUser();

  const auth0Id = user?.sub;
  const { data: profileData, isFetching, isLoading: isLoadingProfile, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })

  useEffect(() => {
    if(profileData) {
      setSectionSelected('activity');
    } else if (user && !isFetching && !isLoadingUser && !profileData) {
      setSectionSelected('profile');
    }
  }, [isFetching, isLoadingUser, profileData, user])

  return (
    <Box style={{ minHeight: '90vh' }}>
      <ProfileInformation
        profileData={profileData}
        isLoadingUser={isLoadingUser}
        isLoadingProfile={isLoadingProfile}
        user={user}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={2}>
        <Button
          color='success'
          startIcon={<DynamicFeedIcon />}
          onClick={() => setSectionSelected('activity')}
        >
          Activity
        </Button>
        <Button
          color='success'
          startIcon={<EditIcon />}
          onClick={() => setSectionSelected('edit')}
        >
          Edit Profile
        </Button>
      </Box>
      {sectionSelected === 'activity' ?
        <Activity/> :
        <EditProfile
          auth0Id={auth0Id}
        />
      }
    </Box>
  )
}