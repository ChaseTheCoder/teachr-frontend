'use client'

import React from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { Add, CalendarMonth, Edit, House, Note, Person, QuestionAnswer } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  let pathname = usePathname()

  return (
    <aside>
      <Box
        sx={{ padding: 2, height: '100vh' }}
      >
        <Stack 
          style={{textAlign: "center"}}
          gap={2}
        >
          <Button
            variant='contained'
            startIcon={<Add />}
            href='/new-post'
            color='success'
            sx={{ marginBottom: 3 }}
          >
            Post
          </Button>
          <Button
            variant={pathname === '/feed' ? 'outlined' : 'text'}
            startIcon={<QuestionAnswer />}
            href='/feed'
            color='success'
          >
            Feed
          </Button>
          <Button
            variant={pathname === '/profile' ? 'outlined' : 'text'}
            startIcon={<Person />}
            href='/profile'
            color='success'
          >
            Profile
          </Button>
          <Button
            variant={pathname === '/plans' ? 'outlined' : 'text'}
            startIcon={<Edit />}
            href='/plans'
            color='success'
          >
            Plans
          </Button>
        </Stack>
      </Box>
    </aside>
  )
}