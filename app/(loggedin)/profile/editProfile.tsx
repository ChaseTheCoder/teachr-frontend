import React, { useEffect, useState } from 'react';
import Surface from '../../../components/surface/Surface';
import { LoadingButton } from '@mui/lab';
import { Box, Skeleton, TextField } from '@mui/material';
import { getData, postOrPatchData } from '../../../services/authenticatedApiCalls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

interface props {
  auth0Id: string;
  signUpPage?: boolean;
}

export default function EditProfile({ auth0Id, signUpPage }: props) {
  const queryClient = useQueryClient();
  const { user, error, isLoading: userLoading } = useUser();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [teacherName, setTeacherName] = useState(null);
  const [title, setTitle] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [newProfile, setNewProfile] = useState(signUpPage);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  const { data: profileData, isFetching, isLoading: isLoadingProfile, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })

  useEffect(() => {
    if (!isLoadingProfile && profileData && !isError && signUpPage) {
      router.push('/feed');
    }
  }, [isLoadingProfile, profileData, router, isError, signUpPage]);

  useEffect(() => {
    if (!isLoadingProfile && !profileData) {
      setNewProfile(true);
    } else {
      setNewProfile(false);
    }
  }, [isLoadingProfile, profileData])

  useEffect(() => {
    if (!isFetching && !isLoadingProfile && user) {
      setFirstName(profileData ? profileData.first_name : '')
      setLastName(profileData ? profileData.last_name : '')
      setTeacherName(profileData ? profileData.teacher_name : '')
      setTitle(profileData ? profileData.title : '')
    }
  }, [isFetching, isLoadingProfile, profileData, user])

  const mutationPost = useMutation({
    mutationFn: () => {
      const body = {
        user_id: auth0Id,
        first_name: firstName,
        last_name: lastName,
        teacher_name: teacherName,
        title: title
      };
      return postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`, 'POST', body);
    },
    onSuccess: (data) => {
      // Handle success (e.g., show a success message, update state, etc.)
      console.log('Profile added successfully:', data);
      if (signUpPage) {
        window.location.href = '/feed';
      }
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Error posting profile:', error);
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ['profile']})
    }
  });

  const mutationPatch = useMutation({
    mutationFn: () => {
      const body = {
        user_id: auth0Id,
        first_name: firstName,
        last_name: lastName,
        teacher_name: teacherName,
        title: title
      };
      return postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile/${profileData.id}`, 'PATCH', body);
    },
    onSuccess: (data) => {
      // Handle success (e.g., show a success message, update state, etc.)
      console.log('Profile added successfully:', data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Error posting profile:', error);
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ['profile']})
    }
  });

  const handlePostProfile = () => {
    newProfile ? mutationPost.mutate() : mutationPatch.mutate()
  };

  useEffect(() => {
    if (profileData && user) {
      if (profileData.first_name !== firstName || profileData.last_name !== lastName || profileData.teacher_name !== teacherName || profileData.title !== title) {
        setDisableUpdate(false)
      } else {
        setDisableUpdate(true)
      }
    } else if (!profileData) {
      if(firstName !== '' && lastName !== '' && teacherName !== '' && title !== '') {
        setDisableUpdate(false)
      } else {
        setDisableUpdate(true)
      }
    }
  }, [firstName, lastName, teacherName, user, profileData, title])

  useEffect(() => {
    setPageLoading(!user || isLoadingProfile || isFetching || (profileData !== undefined && signUpPage));
  },[user, isLoadingProfile, isFetching, profileData, signUpPage]);
  
  return (
    <Surface>
      <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={3}>
        {pageLoading ?
          <>
            <Skeleton variant='text' sx={{ height: '50px' }} />
            <Skeleton variant='text' sx={{ height: '50px' }} />
            <Skeleton variant='text' sx={{ height: '50px' }} />
            <Skeleton variant='text' sx={{ height: '50px' }} />
          </> :
          <>
            <TextField 
              fullWidth
              required
              color='success'
              id='standard-basic'
              label='First Name'
              variant='standard'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField 
              fullWidth
              required
              color='success'
              id='standard-basic'
              label='Last Name'
              variant='standard'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField 
              fullWidth
              required
              color='success'
              id="standard-basic"
              label='Display / Teacher Name'
              variant='standard'
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
            />
            <TextField 
              fullWidth
              required
              color='success'
              id='standard-basic'
              label='Role / Title'
              variant='standard'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </>
      }
      <LoadingButton
        color='success'
        variant='contained'
        disabled={disableUpdate && !isLoadingProfile}
        size='small'
        onClick={() => handlePostProfile()}
        loading={pageLoading}
        >
        { newProfile ? 'Create Profile' : 'Update Profile' }
      </LoadingButton>
      </Box>
    </Surface>
  );
};