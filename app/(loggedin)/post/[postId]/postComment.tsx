'use client'

import React, { useState } from 'react';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { getData, postOrPatchData } from '../../../../services/authenticatedApiCalls';
import Surface from '../../../../components/surface/Surface';

type Props = {
  postId: string
}

export default function PostComment({ postId }: Props) {
  const queryClient = useQueryClient();
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const [body, setBody] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isTextFieldFocused, setTextFieldFocused] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const newPost = {
      user: profileData.id,
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
    }
  };

  if (isLoadingUser || isLoadingProfile) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} >
      <Skeleton variant='rounded' height={80} />
    </Box>
  )

  return (
    <Surface>
      <Typography variant='body1' component='h2' gutterBottom sx={{ fontWeight: 'bold' }}>
      Respond to Post
      </Typography>
      <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
        color='success'
        variant='standard'
        value={isTextFieldFocused ? body : ''}
        onChange={(e) => setBody(e.target.value)}
        onFocus={() => setTextFieldFocused(true)}
        fullWidth
        required
        multiline
        />
      </Box>
      {isTextFieldFocused && (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
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
            disabled={body === '' || isLoadingProfile || !profileData}
            loading={isLoading}
          >
            Post
          </LoadingButton>
        </Box>
      )}
      </form>
    </Surface>
  );
}