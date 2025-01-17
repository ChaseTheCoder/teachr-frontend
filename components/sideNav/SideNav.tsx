'use client'

import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add, Home } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useUserContext } from '../../context/UserContext';

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
        </Stack>
      </Box>
    </aside>
  )
}