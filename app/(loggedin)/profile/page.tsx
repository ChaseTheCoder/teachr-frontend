'use client'

import React, { useEffect, useState } from 'react';
import Surface from '../../../components/surface/Surface';
import { Box, Skeleton, TextField, Typography } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, postOrPatchData } from '../../../services/authenticatedApiCalls';
import { LoadingButton } from '@mui/lab';

export default function Profile() {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [teacherName, setTeacherName] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [newProfile, setNewProfile] = useState(null);
  const { user, error, isLoading: userLoading } = useUser();

  const auth0Id = user?.sub;
  const { data: profileData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })
  console.log('profileData:', user)

  useEffect(() => {
    if (!isFetching && !isLoading && user) {
      setFirstName(profileData ? profileData.first_name : '')
      setLastName(profileData ? profileData.last_name : '')
      setTeacherName(profileData ? profileData.teacher_name : '')
    }
  }, [isFetching, isLoading, profileData, user])

  const mutationPost = useMutation({
    mutationFn: () => {
      const body = {
        user_id: auth0Id,
        first_name: firstName,
        last_name: lastName,
        teacher_name: teacherName
      };
      return postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`, 'POST', body);
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

  const mutationPatch = useMutation({
    mutationFn: () => {
      const body = {
        user_id: auth0Id,
        first_name: firstName,
        last_name: lastName,
        teacher_name: teacherName
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
    if (!isFetching && !isLoading && user) {
      profileData ? setNewProfile(false) : setNewProfile(true)
    }
  }, [user, userLoading, isFetching, isLoading, profileData])

  useEffect(() => {
    if (profileData && user) {
      if (profileData.first_name !== firstName || profileData.last_name !== lastName || profileData.teacher_name !== teacherName) {
        setDisableUpdate(false)
      } else {
        setDisableUpdate(true)
      }
    } else if (user) {
      if(user.given_name !== firstName || user.family_name !== lastName || teacherName !== '') {
        setDisableUpdate(false)
      } else {
        setDisableUpdate(true)
      }
    }
  }, [firstName, lastName, teacherName, user, profileData])

  
  return (
    <Box style={{ minHeight: '90vh' }}>
      <Surface>
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '1rem' }} gap={3}>
          <Typography variant='h1' fontSize={32}>Profile</Typography>
          {isLoading || firstName === null ?
            <Skeleton variant='text' sx={{ height: '50px' }} />
            :
            <TextField 
              fullWidth
              color='success'
              id="standard-basic"
              label="First Name"
              variant="standard"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          }
          {isLoading || lastName === null ?
            <Skeleton variant='text' sx={{ height: '50px' }} />
            :
            <TextField 
              fullWidth
              color='success'
              id="standard-basic"
              label="Last Name"
              variant="standard"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          }
          {isLoading || teacherName === null ?
            <Skeleton variant='text' sx={{ height: '50px' }} />
            :
            <TextField 
              fullWidth
              color='success'
              id="standard-basic"
              label="Teacher Name"
              variant="standard"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
            />
          }
        </Box>
        <LoadingButton
            color='success'
            variant='contained'
            disabled={disableUpdate && !isLoading}
            size='small'
            onClick={() => handlePostProfile()}
            loading={isLoading}
          >
            { newProfile ? 'Create Profile' : 'Update Profile' }
          </LoadingButton>
      </Surface>
    </Box>
  )
}