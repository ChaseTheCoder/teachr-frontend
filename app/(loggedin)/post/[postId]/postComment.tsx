'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { getData, postOrPatchData } from '../../../../services/authenticatedApiCalls';
import { IProfile } from '../../../../types/types';
import { useUserContext } from '../../../../context/UserContext';

type Props = {
  postId: string
}

export default function PostComment({ postId }: Props) {
  const queryClient = useQueryClient();
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const [body, setBody] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isTextFieldFocused, setTextFieldFocused] = useState(false);
  
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const newPost = {
      user: profileData?.id,
      body: body
    };

    try {
      await postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/comments/`, 'POST', newPost);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setBody('');
    } catch (error) {
      console.error('Error posting new data:', error);
    } finally {
      setLoading(false);
      setTextFieldFocused(false);
    }
  };

  if (isLoadingUser || isLoadingProfileData) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} >
      <Skeleton variant='rounded' height={80} />
    </Box>
  )

  return (
    <Box
      sx={{ 
        paddingX: 2,
        paddingTop: 1.5,
        marginBottom: 1.5,
        borderRadius: 4,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}
      gap={1}
    >
      {/* <Typography variant='body1' component='h2' gutterBottom sx={{ fontWeight: 'bold' }}>
      Respond to Post
      </Typography> */}
      <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
        color='success'
        variant='standard'
        placeholder='Respond to Post'
        value={isTextFieldFocused ? body : ''}
        onChange={(e) => setBody(e.target.value)}
        onFocus={() => setTextFieldFocused(true)}
        fullWidth
        multiline
        />
      </Box>
      {isTextFieldFocused && (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 1 }}>
          <Button
            onClick={() => setTextFieldFocused(false)}
            color='error'
          >
            Cancel
          </Button>
          <LoadingButton
            type='submit'
            variant='contained'
            color='success'
            disabled={body === '' || isLoadingProfileData || !profileData}
            loading={isLoading}
          >
            Post
          </LoadingButton>
        </Box>
      )}
      </form>
    </Box>
  );
}