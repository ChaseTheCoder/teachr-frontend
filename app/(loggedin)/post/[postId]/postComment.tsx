'use client'

import React, { useState } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { getData, postOrPatchData } from '../../../../services/authenticatedApiCalls';
import { IProfile } from '../../../../types/types';
import { useUserContext } from '../../../../context/UserContext';
import Editor from '../../../../components/editor';

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

  console.log('Profile Data:', profileData);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitting comment:', body);
    console.log('Current User ID:', profileData?.id);
    
    // Add validation to ensure profileData exists
    if (!profileData?.id) {
      console.error('Profile data not available');
      return;
    }
    
    setLoading(true);

    const newPost = {
      user_id: profileData.id,
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

  if(!isLoadingUser && !user) return (
    <Button
      color='success'
      href={'/api/auth/signup'}
      variant='contained'
      size='large'
      sx={{ marginBottom: 1.5}}
    >
      Signup to join the conversation!
    </Button>
  );

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
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Editor
            onChange={(data) => {
              setBody(data);
            }}
            value={body}
            placeholder='Respond to Post'
            setIsTextFieldFocused={setTextFieldFocused}
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
              disabled={body === '' || isLoadingProfileData || !profileData?.id} // Check for profileData.id specifically
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