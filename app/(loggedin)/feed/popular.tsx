'use client'

import React from 'react';
import { Box, Typography } from '@mui/material';
import Surface from '../../../components/surface/Surface';
import { AutoAwesome } from '@mui/icons-material';
import VerifyEmail from '../../../components/verifyEmail';
import { useUserContext } from '../../../context/UserContext';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getData } from '../../../services/authenticatedApiCalls';
import { IProfile } from '../../../types/types';

const Popular: React.FC = () => {
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

  return (
    <>
      {user && profileData && profileData.verified === false &&
        <VerifyEmail profileId={profileData.id} />
      }
    </>
  );
};

export default Popular;