import React, { useEffect, useState } from 'react';
import Surface from '../../../../components/surface/Surface';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Divider, Skeleton, TextField, Typography } from '@mui/material';
import { getData, postOrPatchData } from '../../../../services/authenticatedApiCalls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { IProfile } from '../../../../types/types';
import MyEditor from './avatarEditor';
import UploadProfilePic from './avatarEditor';

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
    if (!isLoadingProfileData && profileData && !isErrorProfileData && signUpPage) {
      router.push('/feed');
    }
  }, [isLoadingProfileData, profileData, router, isErrorProfileData, signUpPage]);

  useEffect(() => {
    if (!isLoadingProfileData && !profileData) {
      setNewProfile(true);
    } else {
      setNewProfile(false);
    }
  }, [isLoadingProfileData, profileData])

  useEffect(() => {
    if (!isFetchingProfileData && !isLoadingProfileData && user) {
      setFirstName(profileData ? profileData.first_name : '')
      setLastName(profileData ? profileData.last_name : '')
      setTeacherName(profileData ? profileData.teacher_name : '')
      setTitle(profileData ? profileData.title : '')
    }
  }, [isFetchingProfileData, isLoadingProfileData, profileData, user])

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
    setPageLoading(!user || isLoadingProfileData || isFetchingProfileData || (profileData !== undefined && signUpPage));
  },[user, isLoadingProfileData, isFetchingProfileData, profileData, signUpPage]);
  
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
            <UploadProfilePic profileId={profileData.id} />
            <Divider sx={{ marginY: 2 }} />
            <Typography
              variant='h2'
              fontWeight='bold'
              sx={{ fontSize: '22px'}}
            >
              Displayed Information
            </Typography>
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
        disabled={disableUpdate && !isLoadingProfileData}
        size='small'
        onClick={() => handlePostProfile()}
        loading={pageLoading}
        sx={{ width: 'fit-content' }}
        >
        { newProfile ? 'Create Profile' : 'Update Profile' }
      </LoadingButton>
      </Box>
    </Surface>
  );
};