'use client'

import React from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { Add, CalendarMonth, House, Note, Person } from '@mui/icons-material';
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
            startIcon={<House />}
            href='/feed'
            color='success'
          >
            Home
          </Button>
          <Button
            variant={pathname === '/profile' ? 'outlined' : 'text'}
            startIcon={<Person />}
            href='/profile'
            color='success'
          >
            Profile
          </Button>
        </Stack>
      </Box>
    </aside>
  )
}