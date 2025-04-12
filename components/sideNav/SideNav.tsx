'use client'

import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add, Home, Group } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useUserContext } from '../../context/UserContext';
import Link from 'next/link';

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
          <Link
            href={`/newpost`}
            passHref
          >
            <Button
              variant='contained'
              startIcon={<Add />}
              color='success'
              sx={{ marginBottom: 3 }}
            >
              Post
            </Button>
          </Link>
          <Link
            href='/feed'
            passHref
          >
          <Button
            variant={pathname === '/feed' ? 'outlined' : 'text'}
            startIcon={<Home />}
            color='success'
          >
            Home
          </Button>
          </Link>
          {user && (
              <Link
              href={`/groups`}
              passHref
            >
            <Button
              variant={pathname.includes('groups') ? 'outlined' : 'text'}
              startIcon={<Group />}
              color='success'
            >
              Groups
            </Button>
            </Link>
          )}
        </Stack>
      </Box>
    </aside>
  )
}