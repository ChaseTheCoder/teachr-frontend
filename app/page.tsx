'use client'

import React from 'react';
import Image from 'next/image'
import Surface from '../components/surface/Surface';
import { Box, Button, Grid, Typography } from '@mui/material';

export default function Home() {

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <Surface>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Image
              src="/teacher-bluedot.png"
              alt="Educational Illustration"
              width={0}
              height={0}
              sizes="60vw"
              style={{ width: '60%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={6} gap={5}>
            <Typography variant='h1' fontSize={68} fontWeight='bold' align='center' sx={{ paddingBottom: '18px' }}>
              Teachr Lounge
            </Typography>
            <Typography variant='h2' fontSize={22} align='center' sx={{ paddingBottom: '18px' }}>
              Join to automate lesson planning with AI.
            </Typography>
            <Typography variant='h2' fontSize={22} align='center' sx={{ paddingBottom: '18px' }}>
              Stay to see all that AI can do to support teachers.
            </Typography>
            <Button 
              href='/api/auth/login'
              variant='contained'
              color='primary'
              size='large'
            >
              Register & Try for Free
            </Button>
          </Grid>
        </Grid>
      </Surface>

    <Box
      sx={{ padding: 2, marginBottom: 1.5, borderRadius: 4, bgcolor: '#e1f5fe' }}
    >
      <Typography fontSize={18} align='justify' padding={4}>
        I&apos;m a teacher turned software engineer that&apos;s on a mission to build the tools for teachers that I wish I had when I was in the classroom. I&apos;m building Teachr Lounge to help teachers use AI to create co-create content specific for their students to save time so they can focus on the parts of their job that are most important: building relationships with students and helping them learn.
      </Typography>
    </Box>
    </Box>
  )
}