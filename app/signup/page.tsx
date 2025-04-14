'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, TextField, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import Surface from '../../components/surface/Surface';
import { postOrPatchData } from '../../services/authenticatedApiCalls';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const { user, error: userError, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [title, setTitle] = useState('');
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if(isLoadingUser ||
      firstName  === '' ||
      lastName === '' ||
      teacherName === '' ||
      title === ''
    ) {
      setDisableUpdate(true);
    } else {
      setDisableUpdate(false);
    }
  }, [firstName, isLoadingUser, lastName, teacherName, title]);

  const mutationPost = useMutation({
    mutationFn: () => {
      setError(false);
      setSavingProfile(true);
      setError(null);
      const body = {
        user_id: auth0Id,
        first_name: firstName,
        last_name: lastName,
        teacher_name: teacherName,
        title: title
      };
      return postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`, 'POST', body);
    },
    onSuccess: () => {
      router.push('/feed');
    },
    onError: (error) => {
      console.error('Error posting profile:', error);
      setError(true);
      setSavingProfile(false);
    },
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '90vh', width: '100%', marginTop: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h4' component='h1' gutterBottom>Create Profile Before Using App</Typography>
        <Surface>
          <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={3}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error creating profile. Please refersh page and try again.
              </Alert>
            )}
            {userError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error getting your new login information. Please try again. Email chasesheaff@teacher-lounge.com for support.
              </Alert>
            )}
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
            <LoadingButton
              color='success'
              variant='contained'
              disabled={disableUpdate}
              size='small'
              onClick={() => mutationPost.mutate()}
              loading={savingProfile}
              sx={{ width: 'fit-content' }}
            >
                Create Profile
            </LoadingButton>
          </Box>
        </Surface>
      </Box>
    </Box>
  )
}