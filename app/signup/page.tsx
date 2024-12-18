'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import EditProfile from '../(loggedin)/profile/editProfile';
import { Box, Typography } from '@mui/material';

export default function SignUp() {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '90vh', width: '100%', marginTop: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h4' component='h1' gutterBottom>One last step, fill out your profile.</Typography>
        <EditProfile
          auth0Id={auth0Id}
          signUpPage
        />
      </Box>
    </Box>
  )
}