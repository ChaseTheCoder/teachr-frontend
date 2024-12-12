'use client'

import React from 'react';
import Image from 'next/image'
import Surface from '../components/surface/Surface';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { LoadingButton } from '@mui/lab';

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column' }} gap={4}>
      <Surface>
        <Grid container spacing={2} alignItems="center" sx={{ paddingY: { md: '3rem', xs: 0 } }}>
          <Grid item xs={12} md={5}>
            <Image
              src="/Main.png"
              alt="Educational Illustration"
              width={0}
              height={0}
              sizes="60vw"
              style={{ width: '60%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={7} gap={5}>
            <Stack
              gap={2}
            >
              <Typography 
              variant='h1' 
              fontSize={{ xs: 48, md: 68 }} 
              fontWeight='bold' 
              align='center'
              >
                Teachr Lounge
              </Typography>
              <Typography variant='h2' fontSize={{ xs: 18, md: 22 }} align='center'>
                A digital lounge to create, share, and collaborate on unit & lesson plans.
              </Typography>
              <Typography variant='h2' fontSize={{ xs: 18, md: 22 }} align='center'>
                Software & AI tools to save educators time for what cannot be automated.
              </Typography>
              <Box display="flex" justifyContent="center">
                {!user && !isLoading &&
                  <Button
                    color='success'
                    href={'/api/auth/signup' }
                    variant='contained'
                    size='large'
                  >
                    Signup, it&apos;s Free!
                  </Button>
                }
              </Box>
              <Box display="flex" justifyContent="center">
                <Button
                  variant='outlined'
                  color='success'
                  href="#what-is"
                >
                  Learn more about Teachr Lounge
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Surface>
      <Grid container spacing={{ xs: 2, md: 6 }} sx={{ paddingY: { md: '3rem', xs: 0 }, paddingX: { md: '3rem', xs: 0 } }}>
        <Grid item xs={12} md={6}>
          <Typography variant='h2' align='justify' fontSize={{ xs: 18, md: 22 }} lineHeight={2}>
            We are an emerging lesson planning app by teachers, for teachers. We want to solve all your lesson planning needs. We are currently in beta and would love your feedback.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} gap={2} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Button color='success' size='large' variant='outlined' component='a' href="mailto:teachrloungeai@google.com">
            Send us your feedback, ask for new features, or tell us what you love!
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ paddingY: { md: '3rem', xs: 0 }, paddingX: { md: '3rem', xs: '1rem' } }}>
        <Grid item xs={12} id='what-is'>
          <Typography variant='h1' align='center' fontSize={42} fontWeight='bold'>
            What is Teachr Lounge?
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Surface>
            <Stack
              gap={2}
              alignItems='center'
            >
              <Image
              src="/Plan.png"
              alt="Educational Illustration"
              width={0}
              height={0}
              sizes="60vw"
              style={{ width: 'auto', height: '200px' }}
              />
              <Box>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  align='center'
                >
                  Write & save your plans.
                </Typography> 
                <Typography
                  variant='body1'
                  align='center'
                  fontSize={20}
                >
                  Write your plans and save them under units and subjects. Have them to use year after year.
                </Typography>
              </Box>
            </Stack>
          </Surface>
        </Grid>
        <Grid item xs={12} md={6}>
          <Surface>
            <Stack
              gap={3}
              alignItems='center'
            >
              <Image
                src="/Automate.png"
                alt="Educational Illustration"
                width={0}
                height={0}
                sizes="60vw"
                style={{ width: 'auto', height: '200px' }}
              />
              <Box>
              <Typography
                  variant='h4'
                  fontWeight='bold'
                  align='center'
                >
                  Automate planning.
                </Typography> 
                <Typography
                  variant='body1'
                  align='center'
                  fontSize={20}
                >
                  AI tools to create content. Create a school year calendar and automate with your saved plans.
                </Typography>
              </Box>
            </Stack>
          </Surface>
        </Grid>
        <Grid item xs={12} md={6}>
          <Surface>
            <Stack
              gap={2}
              alignItems='center'
            >
              <Image
                src="/Collaborate.png"
                alt="Educational Illustration"
                width={0}
                height={0}
                sizes="60vw"
                style={{ width: 'auto', height: '200px' }}
              />
              <Box>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  align='center'
                >
                  Collaborate with Educators.
                </Typography> 
                <Typography
                  variant='body1'
                  align='center'
                  fontSize={20}
                >
                  Connect with fellow educators, mentors, and more. Request and recieve feedback alongside your plans.
                </Typography>
              </Box>
            </Stack>
          </Surface>
        </Grid>
        <Grid item xs={12} md={6}>
          <Surface>
            <Stack
              gap={2}
              alignItems='center'
            >
              <Image
                src="/Main.png"
                alt="Educational Illustration"
                width={0}
                height={0}
                sizes="60vw"
                style={{ width: 'auto', height: '200px' }}
              />
              <Box>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  align='center'
                >
                  Share or find plans.
                </Typography> 
                <Typography
                  variant='body1'
                  align='center'
                  fontSize={20}
                >
                  Share or find edcuator created plans in a public library. Add shared plans to your calendar in seconds.
                </Typography>
              </Box>
            </Stack>
          </Surface>
        </Grid>
      </Grid>
    </Box>
  )
}