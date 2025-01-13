'use client'

import React, { useState } from 'react';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getData, postOrPatchData } from '../../../services/authenticatedApiCalls';
import Surface from "../../../components/surface/Surface";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { IProfile } from '../../../types/types';

export default function NewPost() {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = new QueryClient();
  
  const { data: profileData, isLoading: isLoadingProfile, isError } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    initialData: () => {
      return queryClient.getQueryData(['profile']);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const newPost = {
      title: title,
      body: body
    };

    try {
      await postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/user/${profileData.id}/`, 'POST', newPost);
      router.push('/feed');
    } catch (error) {
      console.error('Error posting new data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUser || isLoadingProfile) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rectangular' height={80} />
    </Box>
  )

  return (
    <Surface>
      <Typography variant='h4' component='h1' gutterBottom>
      Create a Public Post
      </Typography>
      <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
        color='success'
        variant='standard'
        label='Title: What do you want to ask or share?'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        />
      </Box>
      <Box mb={2}>
        <TextField
        color='success'
        variant='standard'
        label='Body: Provide more context to your post'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        fullWidth
        multiline
        rows={4}
        />
      </Box>
      <LoadingButton
        type='submit'
        variant='contained'
        color='success'
        disabled={title === '' || isLoadingProfile || !profileData}
        loading={isLoading}
      >
        Post
      </LoadingButton>
      </form>
    </Surface>
  );
}