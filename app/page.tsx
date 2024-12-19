'use client'

import React from 'react';
import Image from 'next/image'
import Surface from '../components/surface/Surface';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import Post from '../components/post/post';

const postExamples = [
  {
    profile: {
      "id": "2d770e04-bd9d-4def-9b5d-feec263cb570",
      "auth0_id": "google-oauth2|107960761193972798603",
      "first_name": "Chase",
      "last_name": "Sheaff",
      "teacher_name": "Ms. B",
      "title": "2nd Grade Teacher",
      "profile_pic": "/media/profile_pics/Screenshot_2024-11-14_at_8.45.15PM.png"
    },
    post: {
      "id": "6c7222c5-567a-44cd-960c-6ce12af0e163",
      "title": "Am I supposed to be running small groups anymore?",
      "body": "I've been reading and hearing from a few teacher friends that small groups are not the best way to teach. I'm a 3rd grade teacher and I've been doing small groups for years. I'm not sure what to do now. What is the research saying?",
      "timestamp": "2024-11-19T21:33:06.648096Z",
      "user": "2d770e04-bd9d-4def-9b5d-feec263cb570"
    }
  },
  {
    profile: {
      "id": "2d770e04-bd9d-4def-9b5d-feec263cb570",
      "auth0_id": "google-oauth2|107960761193972798603",
      "first_name": "Chase",
      "last_name": "Sheaff",
      "teacher_name": "Mr. Sheaff",
      "title": "6th Grade Science",
      "profile_pic": "/media/profile_pics/Screenshot_2024-11-14_at_8.45.15PM.png"
    },
    post: {
      "id": "6c7222c5-567a-44cd-960c-6ce12af0e163",
      "title": "Cell Phones in the Classroom",
      "body": "My school doesn't have a policy on cell phones. I'm a 6th grade teacher and engagement has declined because of cell phone usage. What do you all do?",
      "timestamp": "2024-11-19T21:33:06.648096Z",
      "user": "2d770e04-bd9d-4def-9b5d-feec263cb570"
    }
  },
  {
    profile: {
      "id": "2d770e04-bd9d-4def-9b5d-feec263cb570",
      "auth0_id": "google-oauth2|107960761193972798603",
      "first_name": "Chase",
      "last_name": "Sheaff",
      "teacher_name": "Mrs. Alvera",
      "title": "2nd Grade Teacher",
      "profile_pic": "/media/profile_pics/Screenshot_2024-11-14_at_8.45.15PM.png"
    },
    post: {
      "id": "6c7222c5-567a-44cd-960c-6ce12af0e163",
      "title": "Resources for differentiating worksheets",
      "body": "I'm a 2nd year teacher and definitly overwhelmed. I have a few students who are really struggling and I'm not sure how to help them. I've been trying to find resources online but I'm not sure what to look for. What are resources that are very simple to implement?",
      "timestamp": "2024-11-19T21:33:06.648096Z",
      "user": "2d770e04-bd9d-4def-9b5d-feec263cb570"
    }
  }
]

export default function Home() {

  return (
    <Box sx={{ paddingX: '10px', display: 'flex' }}>
      <Grid container spacing={2} sx={{ paddingY: { md: '1rem', xs: 0 } }}>
          <Grid item xs={12} md={5} gap={5}>
            <Surface>
              <Box sx={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '75vh' }} gap={3}>
                <Image
                  src="/Main.png"
                  alt="Educational Illustration"
                  width={0}
                  height={0}
                  sizes="60vw"
                  style={{ width: '60%', height: 'auto' }}
                />
                <Typography variant='h1' fontWeight='bold' fontSize={{ xs: 24, md: 34 }} align='center'>
                  Connect with teachers nationwide.
                </Typography>
                <Typography variant='h2' fontSize={{ xs: 14, md: 18 }} align='center'>
                  Tune in to what teachers are thinking, get feedback, and get support from real teachers. Get support and real answers from teachers who are still actually in the classroom...
                </Typography>
                <Box display="flex" justifyContent="center">
                  <Button
                    color='success'
                    href={'/api/auth/signup' }
                    variant='contained'
                    size='large'
                  >
                    Signup, it&apos;s Free!
                  </Button>
              </Box>
            </Box>
          </Surface>
          </Grid>
          <Grid item xs={12} md={7}>
            {
              postExamples.map((post) => {
                return (
                  <Post key={post.post.id} post={post.post} profile={post.profile} homePage />
                )
              })
            }
          </Grid>
        </Grid>
    </Box>
  )
}