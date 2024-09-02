import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { CalendarMonth, House, Note } from '@mui/icons-material';
import Link from 'next/link';

export default function SideNav() {

  return (
    <aside>
      <Stack 
        style={{textAlign: "center", paddingTop: 12 }}
        gap={2}
      >
        <Link
          href='/dashboard'
        >
          <Box
            sx={{ borderRadius: 4, padding: 1, '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <IconButton>
              <House/>
            </IconButton>
            <Typography
              variant='body2'
            >
              Dashboard
            </Typography>
          </Box>
        </Link>
        <Link
          href='/subject'
        >
          <Box
            sx={{ borderRadius: 4, padding: 1, '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <IconButton>
              <Note/>
            </IconButton>
            <Typography
              variant='body2'
            >
              Subjects
            </Typography>
          </Box>
        </Link>
        <Link
          href='/schedule'
        >
          <Box
            sx={{ borderRadius: 4, padding: 1, '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <IconButton>
              <CalendarMonth/>
            </IconButton>
            <Typography
              variant='body2'
            >
              Schedule
            </Typography>
          </Box>
        </Link>
      </Stack>
    </aside>
  )
}