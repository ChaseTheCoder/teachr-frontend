'use client'

import React, { useState } from 'react';
import { Box, Button, Grid, Skeleton, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { postOrPatchData } from '../../../services/authenticatedApiCalls';
import Surface from "../../../components/surface/Surface";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { IProfile } from '../../../types/types';
import { getDataNoToken } from '../../../services/unauthenticatedApiCalls';
import Editor from '../../../components/editor';

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
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
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

  if(!auth0Id && !profileData) return (
    <Surface>
      <Typography variant='h4' component='h1' gutterBottom>
        Create a Public Post
      </Typography>
      <Typography variant='body1' component='p' gutterBottom paddingBottom={3}>
        You need to create an account in order to post.
      </Typography>
      <Button
        color='success'
        href={'/api/auth/signup'}
        variant='contained'
        size='large'
        sx={{ marginBottom: 2 }}
      >
        Signup, it&apos;s Free!
      </Button>
    </Surface>
  );
  if(auth0Id && !profileData) return (
    <Surface>
      <Typography variant='h4' component='h1' gutterBottom>
        Create a Public Post
      </Typography>
      <Typography variant='body1' component='p' gutterBottom>
        You&apos;re logged in, but we can&apos;t seem to find your profile.
      </Typography>
      <Button
        color='success'
        href={'/signup'}
        variant='contained'
        size='large'
      >
        Create Your Profile
      </Button>
      <Typography variant='body1' component='p' gutterBottom>
        Already signed up? Add profile <a href='/profile'>here</a>.
      </Typography>
    </Surface>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <Surface>
          <Typography variant='h4' component='h1' gutterBottom>
          Create a Public Post
          </Typography>
          <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
            color='success'
            variant='outlined'
            label='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            />
          </Box>
          <Editor
            onChange={(data) => {
              setBody(data);
            }}
            value={body}
          />
          <LoadingButton
            type='submit'
            variant='contained'
            color='success'
            disabled={title === '' || isLoadingProfile || !profileData}
            loading={isLoading}
            sx={{ marginTop: 2 }}
          >
            Post
          </LoadingButton>
          </form>
        </Surface>
      </Grid>
    </Grid>
  );
}