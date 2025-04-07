'use client'

import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add, Home, Group } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
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
          <Button
            variant='contained'
            startIcon={<Add />}
            href='/newpost'
            color='success'
            sx={{ marginBottom: 3 }}
          >
            Post
          </Button>
          <Button
            variant={pathname === '/feed' ? 'outlined' : 'text'}
            startIcon={<Home />}
            href='/feed'
            color='success'
          >
            Home
          </Button>
          {user && (
            <Button
              variant={pathname.includes('groups') ? 'outlined' : 'text'}
              startIcon={<Group />}
              href='/groups/'
              color='success'
            >
              Groups
            </Button>
          )}
        </Stack>
      </Box>
    </aside>
  )
}