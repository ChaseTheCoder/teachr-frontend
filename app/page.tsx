import React from 'react';
import Image from 'next/image'
import Surface from '../components/surface/Surface';
import { Box, Button, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import Post from '../components/post/post';

const postExamples = [
  {
    profile: {
      "id": "2d770e04-bd9d-4def-9b5d-feec263cb571",
      "auth0_id": "google-oauth2|107960761193972798603",
      "first_name": "Chase",
      "last_name": "Sheaff",
      "teacher_name": "Ms. B",
      "title": "2nd Grade Teacher",
      "profile_pic": "/media/profile_pics/Screenshot_2024-11-14_at_8.45.15PM.png",
      "verified": true
    },
    post: {
      "id": "6c7222c5-567a-44cd-960c-6ce12af0e164",
      "title": "Am I supposed to be running small groups anymore?",
      "body": "I've been reading and hearing from a few teacher friends that small groups are not the best way to teach. I'm a 3rd grade teacher and I've been doing small groups for years. I'm not sure what to do now. What is the research saying?",
      "timestamp": "2024-11-19T21:33:06.648096Z",
      "user": "2d770e04-bd9d-4def-9b5d-feec263cb571",
      "upvotes": 100,
      "downvotes": 0,
      "has_upvoted": true,
      "has_downvoted": false
    }
  },
  {
    profile: {
      "id": "2d770e04-bd9d-4def-9b5d-feec263cb572",
      "auth0_id": "google-oauth2|107960761193972798603",
      "first_name": "Chase",
      "last_name": "Sheaff",
      "teacher_name": "Mr. Sheaff",
      "title": "6th Grade Science",
      "profile_pic": "/media/profile_pics/Screenshot_2024-11-14_at_8.45.15PM.png",
      "verified": true
    },
    post: {
      "id": "6c7222c5-567a-44cd-960c-6ce12af0e165",
      "title": "Cell Phones in the Classroom",
      "body": "My school doesn't have a policy on cell phones. I'm a 6th grade teacher and engagement has declined because of cell phone usage. What do you all do?",
      "timestamp": "2024-11-19T21:33:06.648096Z",
      "user": "2d770e04-bd9d-4def-9b5d-feec263cb572",
      "upvotes": 53,
      "downvotes": 0,
      "has_upvoted": true,
      "has_downvoted": false
    }
  },
  {
    profile: {
      "id": "2d770e04-bd9d-4def-9b5d-feec263cb573",
      "auth0_id": "google-oauth2|107960761193972798603",
      "first_name": "Chase",
      "last_name": "Sheaff",
      "teacher_name": "Mrs. Alvera",
      "title": "2nd Grade Teacher",
      "profile_pic": "/media/profile_pics/Screenshot_2024-11-14_at_8.45.15PM.png",
      "verified": true
    },
    post: {
      "id": "6c7222c5-567a-44cd-960c-6ce12af0e166",
      "title": "Resources for differentiating worksheets",
      "body": "I'm a 2nd year teacher and definitly overwhelmed. I have a few students who are really struggling and I'm not sure how to help them. I've been trying to find resources online but I'm not sure what to look for. What are resources that are very simple to implement?",
      "timestamp": "2024-11-19T21:33:06.648096Z",
      "user": "2d770e04-bd9d-4def-9b5d-feec263cb573",
      "upvotes": 33,
      "downvotes": 0,
      "has_upvoted": false,
      "has_downvoted": false
    }
  }
]

export const metadata = {
  title: 'Teacher Lounge - A Solution Oriented & Social Hub for Educators',
  charSet: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
  description: 'Connect with teachers in the ultimate teacher lounge! Post questions, find solutions, share humor, and upvote the best answers in this supportive social platform for educators.',
  keywords: 'teachers, teacher humor, education community, teacher questions, classroom tips, teaching solutions, educators, teacher forum, teacher social network',
  author: 'Teacher Lounge Community',
  icon: '/favicon.ico',
};

export default function Home() {

  return (
    <Box sx={{ marginY: '1rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Surface>
        <Grid container spacing={2} sx={{ paddingY: { md: '4rem', xs: '.25rem' } }}>
            <Grid item xs={12} md={5}>
                <Box sx={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }} gap={{xs: 1, md: 7}}>
                  <Image
                    src="/Main.png"
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
                <Typography variant='h1' fontWeight='bold' fontSize={{ xs: 26, sm: 32, md: 44 }} align='center'>
                  Connect with Teachers Nationwide
                </Typography>
                <Typography variant='h2' fontSize={{ xs: 14, sm: 16, md: 18 }} color='textSecondary'>
                  Post questions, share resources, and connect in a digital teachers&apos; lounge.
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
      <Grid container spacing={2} sx={{ paddingX: { xs: 1, md: 4 } }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingX: { xs: 1, md: 4 }, paddingTop: { xs: 3, md: 0 }, textAlign: { xs: 'center', md: 'left' } }} gap={{ xs: 2, md:3 }}>
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 24, sm: 28, md: 34 }}>See a Feed of Teacher Posts</Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22, md: 26 }} color='textSecondary'>
              Stay up to date to what teachers are discussing.
            </Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22, md: 26 }} color='textSecondary'>
              Verified teachers get a stem & leaf on profile.
            </Typography>
            <Typography variant='h3' fontSize={{ xs: 18, sm: 22, md: 26 }} color='textSecondary' sx={{ paddingBottom: 3 }}>
              Share resources with educators.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {
            postExamples.map((post) => {
              return (
                <Post key={post.post.id} post={post.post} profile={post.profile} homePage />
            )})
          }
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center', alignItems: 'center', paddingTop: 6 }} gap={{xs: 1, md: 2}}>
        <Surface>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center', alignItems: 'center', padding: 4, width: { xs: '90vw', md: '60vw' } }} gap={3}>
            <Image
              src="/Collaborate.png"
              alt="Educational Illustration of teachers connecting online."
              width={0}
              height={0}
              sizes="30vw"
              style={{ width: '50%', height: 'auto' }}
            />
            <Typography variant='h2' fontWeight='bold' fontSize={{ xs: 28, sm: 38, md: 42 }} color='success'>Our Mission</Typography>
            <Typography fontSize={{ xs: 16, md: 20 }} align='justify' color='textSecondary'>
              Our mission is to unite teachers on one platform through shared knowledge and resources. We believe that teachers are the best resource for other teachers. And our app will support them and provide features to elevate their profession and their professional growth.
            </Typography>
          </Box>
        </Surface>
      </Box>
    </Box>
  )
}