'use client'

import React, { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Grid } from '@mui/material'
import SideNav from '../../components/sideNav/SideNav';
import { getData, getSessionId } from '../../services/authenticatedApiCalls';
import RegisterPage from './register/page';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, error, isLoading } = useUser();
  const [ready, setReady] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  
  useEffect(() => {
    setReady(user && !isLoading && !error);
  }, [user, error, isLoading]);

  async function getUser() {
    const getId = await getSessionId()
    try {
      getData(`http://localhost:8000/userprofile/profile/${getId}`)
      .then((subject) => {
        setProfile(subject)
      })
    } catch (err) {
      console.error(err)
    }
  }
  
  useEffect(() => {
    if(ready){
      getUser();
      console.log('profile use effect');
      console.log(profile);
    }
  }, [ready]);
  
  return (
    <Grid container>
      { user && profile &&
        <>
          <Grid xs={1} item={true} sx={{ paddingTop: '18px' }}>
            <SideNav/>
          </Grid>
          <Grid xs={11} item={true}>
            <Box sx={{ paddingTop: '18px', paddingX: '18px' }}>
              {children}
            </Box>
          </Grid>
        </>
      }
      { !profile &&     
        <Grid xs={12} item={true} sx={{ paddingTop: '18px' }}>
          <RegisterPage />
        </Grid>
      }
    </Grid>
)
}
