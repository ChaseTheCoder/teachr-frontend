'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { getData } from '../../../../services/authenticatedApiCalls';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import EditIcon from '@mui/icons-material/Edit';
import Activity, { ActivityLoading } from './activity';
import EditProfile from './editProfile';
import ProfileInformation from './profileInformation';
import { IProfile } from '../../../../types/types';
import { getDataNoToken } from '../../../../services/unauthenticatedApiCalls';

export default function Profile({
  params,
}: {
  params: { profileId: string };
}) {
  const [sectionSelected, setSectionSelected] = useState('activity');
  const [currentUser, setCurrentUser] = useState(null);
  const { user, error, isLoading: isLoadingUser } = useUser();
  const [auth0Id, setAuth0Id] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoadingUser && !auth0Id) {
      setAuth0Id(user.sub);
    }
  }, [user, isLoadingUser, auth0Id]);
  const queryClient = new QueryClient();
  const { data: profileData, isFetching, isLoading: isLoadingProfile, isError } = useQuery<IProfile>({
    queryKey: ['profile', auth0Id],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: auth0Id !== null,
    initialData: () => {
      return queryClient.getQueryData(['profile', auth0Id]);
    },
  })

  useEffect(() => {
    if(!isFetching && !isLoadingUser) {
      if(auth0Id !== null || profileData?.id === params.profileId) {
        setCurrentUser(true);
      } else {
        setCurrentUser(false);
      }
    }
  }, [profileData, auth0Id, isFetching, isLoadingUser, params.profileId]);

  const { data: otherProfileData, isFetching: isFetchingOtherProfile, isLoading: isLoadingOtherProfile, isError: isErrorOtherProfile } = useQuery({
    queryKey: ['otherProfile'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile/${params.profileId}`),
    staleTime: 1000 * 60 * 60,
    enabled: currentUser === false,
  })

  useEffect(() => {
    if(profileData) {
      setSectionSelected('activity');
    } else if (user && !isFetching && !isLoadingUser && !profileData) {
      setSectionSelected('profile');
    }
  }, [isFetching, isLoadingUser, profileData, user])

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
      isLoadingProfile={currentUser ? isLoadingProfile : isLoadingOtherProfile}
      error={currentUser ? isError : isErrorOtherProfile}
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