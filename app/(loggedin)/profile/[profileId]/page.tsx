'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { getData } from '../../../../services/authenticatedApiCalls';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import EditIcon from '@mui/icons-material/Edit';
import Activity from './activity';
import EditProfile from './editProfile';
import ProfileInformation from './profileInformation';
import { IProfile } from '../../../../types/types';
import { getDataNoToken } from '../../../../services/unauthenticatedApiCalls';
import { useUserContext } from '../../../../context/UserContext';
import { ActivityLoading } from '../../../../components/activityLoading';

export default function Profile({
  params,
}: {
  params: { profileId: string };
}) {
  const [sectionSelected, setSectionSelected] = useState('activity');
  const [currentUser, setCurrentUser] = useState(null);
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const queryClient = new QueryClient();
  
  const { data: profileData, isFetching: isFetchingProfileData, isLoading: isLoadingProfileData, isError: isErrorProfileData } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!auth0Id,
    initialData: () => {
      return queryClient.getQueryData(['profile']);
    },
  });

  useEffect(() => {
    if(!isFetchingProfileData && !isLoadingUser) {
      if(auth0Id !== null || profileData?.id === params.profileId) {
        setCurrentUser(true);
      } else {
        setCurrentUser(false);
      }
    }
  }, [profileData, auth0Id, isFetchingProfileData, isLoadingUser, params.profileId]);

  const { data: otherProfileData, isFetching: isFetchingOtherProfile, isLoading: isLoadingOtherProfile, isError: isErrorOtherProfile } = useQuery({
    queryKey: ['otherProfile'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile/${params.profileId}`),
    staleTime: 1000 * 60 * 60,
    enabled: currentUser === false,
  })

  useEffect(() => {
    if(profileData) {
      setSectionSelected('activity');
    } else if (user && !isFetchingProfileData && !isLoadingUser && !profileData) {
      setSectionSelected('profile');
    }
  }, [isFetchingProfileData, isLoadingUser, profileData, user])

  if(currentUser === null || (currentUser === false && isFetchingOtherProfile && isLoadingOtherProfile)) {
    return (
      <ActivityLoading />
    )
  }

  return (
    <Box>
      <ProfileInformation
      profileData={currentUser ? profileData : otherProfileData}
      isLoadingUser={currentUser ? isLoadingUser : isLoadingOtherProfile}
      isLoadingProfile={currentUser ? isLoadingProfileData : isLoadingOtherProfile}
      error={currentUser ? isErrorProfileData : isErrorOtherProfile}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={2}>
      {currentUser && (
        <>
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
        </>
      )}
      </Box>
      {sectionSelected === 'activity' ? (
      <Activity
        profileId={params.profileId}
        profileData={currentUser ? profileData : otherProfileData}
      />
      ) : (
      currentUser && <EditProfile auth0Id={auth0Id} />
      )}
    </Box>
  )
}