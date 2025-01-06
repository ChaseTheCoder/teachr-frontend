'use client'

import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add, Edit, Person, QuestionAnswer } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function SideNav() {
  let pathname = usePathname()
  const { user, error, isLoading } = useUser();
  const auth0Id = user?.sub;

  return (
    <aside>
      <Box
        sx={{ padding: 2, height: '100vh' }}
      >
        <Stack 
          style={{textAlign: "center"}}
          gap={2}
        >
          {user &&
            <Button
              variant='contained'
              startIcon={<Add />}
              href='/new-post'
              color='success'
              sx={{ marginBottom: 3 }}
            >
              Post
          </Button>
          }
          <Button
            variant={pathname === '/feed' ? 'outlined' : 'text'}
            startIcon={<QuestionAnswer />}
            href='/feed'
            color='success'
          >
            Feed
          </Button>
        </Stack>
      </Box>
    </aside>
  )
}