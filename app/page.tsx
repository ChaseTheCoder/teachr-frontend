import React from 'react';
import Image from 'next/image'
import Surface from '../components/surface/Surface';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import HomePosts from '../components/homePosts';

export default function HomePage() {

  return (
    <Box sx={{ marginY: '1rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Surface>
        <Grid container spacing={2} sx={{ paddingY: { md: '4rem', xs: '.25rem' } }}>
            <Grid item xs={12} md={5}>
                <Box sx={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }} gap={{xs: 1, md: 7}}>
                  <Image
                    src="/AppleHappySmile1.png"
                    alt="Educational Illustration"
                    width={0}
                    height={0}
                    sizes="60vw"
                    style={{ width: '60%', height: 'auto' }}
                  />
                </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }} gap={{xs: 1, md: 2}}>
                <Typography variant='h1' fontWeight='bold' fontSize={{ xs: 28, sm: 32, md: 44 }} sx={{ width: '100%' }} align='center'>
                  Q&A Platform Just for Teachers
                </Typography>
                <Typography variant='h2' fontSize={{ xs: 18, sm: 20, md: 22 }} color='textSecondary' sx={{ width: { xs: '90%', sm: '70%' } }}>
                  Separate social media from your professional life and get answers from verified teachers
                </Typography>
                <Box display="flex" justifyContent="center" sx={{ marginTop: '2rem' }}>
                  <Button
                    color='success'
                    href={'/api/auth/signup'}
                    variant='contained'
                    size='large'
                  >
                    Signup, it&apos;s Free!
                  </Button>
                </Box>
              </Box>
            </Grid>
        </Grid>
      </Surface>
      <Grid container spacing={2} sx={{ paddingX: { xs: 1, md: 4 }, my: 4 }}>
        <Grid item xs={12} md={6}>
          <Box 
            sx={{
              padding: 2,
              borderRadius: 4,
              bgcolor: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              src="/Problem.png"
              alt="Apple character smiling and pondering."
              width={0}
              height={0}
              sizes="50vw"
              style={{ width: '80%', height: 'auto' }}
            />
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 24, sm: 28, md: 34 }} mt={{ xs: 0, md: 3 }}>Problem</Typography>
            <Typography fontSize={{ xs: 16, sm: 18 }} sx={{ width: '80%' }} color='textSecondary' align='center'>
              Teacher discussion is siloed across multiple groups within multiple social media apps.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 2,
              borderRadius: 4,
              bgcolor: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              src="/Solution.png"
              alt="Apple character smiling and pondering."
              width={0}
              height={0}
              sizes="50vw"
              style={{ width: '80%', height: 'auto' }}
            />
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 24, sm: 28, md: 34 }} mt={{ xs: 0, md: 3 }}>Solution</Typography>
            <Typography fontSize={{ xs: 16, sm: 18 }} sx={{ width: '80%' }} color='textSecondary' align='center'>
              All teacher discussion and answers in one app! Allows teachers to separate work from social media.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ paddingX: { xs: 1, md: 4 }, marginY: 12 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingX: { xs: 1, md: 4 }, paddingTop: { xs: 3, md: 0 }, textAlign: { xs: 'center', md: 'left' } }} gap={{ xs: 2, md:3 }}>
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 24, sm: 28, md: 34 }}>See a Feed of Teacher Posts</Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22 }} color='textSecondary'>
              Stay up to date to what teachers are discussing.
            </Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22 }} color='textSecondary'>
              Verified teachers get a stem and leaf on their avatar.
            </Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22 }} color='textSecondary' sx={{ paddingBottom: 3 }}>
              Share resources with educators.
            </Typography>
            <Link href='/feed'>
              <Button
                variant='contained'
                color='success'
                endIcon={<ArrowForwardIos />}
                sx={{ marginBottom: 3 }}
              >
                Go To Feed
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <HomePosts />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ paddingX: { xs: 1, md: 4 }, marginY: 12 }}>
        <Grid item xs={12} md={6}>
            <Box sx={{ padding: 2, borderRadius: 4, bgcolor: '#ffffff', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <Image
              src="/AppleSmilePondering1.png"
              alt="Apple character smiling and pondering."
              width={0}
              height={0}
              sizes="30vw"
              style={{ width: '65%', height: 'auto' }}
            />
            </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingX: { xs: 1, md: 4 }, paddingTop: { xs: 3, md: 0 }, maxWidth: '900px' }} gap={{ xs: 2, md:3 }}>
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 24, sm: 28, md: 34 }}>Why Teacher Lounge?</Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22 }} color='textSecondary'>
              We interviewed teachers and they told us:
            </Typography>
            <Box>              
              <Typography fontSize={14} color='textSecondary'>
                &quot;I love new ideas, being in the know, and following what teachers were doing. It was super important to be the best in my field, to be the best in my evaluation.&quot;
              </Typography>
              <Typography fontSize={14} color='textSecondary'>
                -40 Year Veteran Elementary Teacher
              </Typography>
            </Box>
            <Box>
              <Typography fontSize={14} color='textSecondary'>
                &quot;I&apos;m a 13th year teacher and I started a new curriculum. I use FaceBook groups with other teachers, but would really love to separate that from my social media.&quot;
              </Typography>
              <Typography fontSize={14} color='textSecondary'>
                -Special Education Teacher
              </Typography>
            </Box>
            <Box>
              <Typography fontSize={14} color='textSecondary'>
                &quot;I could benefit from getting different perspectives on small groups, state testing, class routine and procedures.&quot;
              </Typography>
              <Typography fontSize={14} color='textSecondary'>
                -2nd Year Teacher
              </Typography>
            </Box>
            <Link href='/feed'>
              <Button
                color='success'
                href={'/api/auth/signup'}
                variant='contained'
                size='large'
              >
                Signup, it&apos;s Free!
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center', alignItems: 'center', paddingTop: 6 }} gap={{xs: 1, md: 2}}>
        <Surface>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center', alignItems: 'center', padding: 4, width: { xs: '90vw', md: '60vw' } }} gap={3}>
            <Image
              src="/AppleHappyPhone.png"
              alt="Educational Illustration of teachers connecting online."
              width={0}
              height={0}
              sizes="30vw"
              style={{ width: '50%', height: 'auto' }}
            />
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 28, sm: 38, md: 42 }} color='success'>Our Mission</Typography>
            <Typography fontSize={{ xs: 16, md: 20 }} align='justify' color='textSecondary'>
              Our mission is to unite teachers on one platform through shared knowledge and resources. We believe that teachers are the best resource for other teachers. And our app will support them and provide features to elevate their profession and their professional growth. As we grow, we&apos;ll add features and limit them to verified teachers to keep the quality of the content high.
            </Typography>
          </Box>
        </Surface>
      </Box>
    </Box>
  )
}