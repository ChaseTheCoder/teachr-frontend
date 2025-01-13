'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add, QuestionAnswer } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUserContext } from '../../context/UserContext';

export default function SideNav() {
  let pathname = usePathname()
  const { user } = useUserContext();

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