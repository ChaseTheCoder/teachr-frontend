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
        <Box>
          <IconButton
            href='/dashboard'
          >
            <House/>
          </IconButton>
          <Typography
            variant='body2'
          >
            Dashboard
          </Typography>
        </Box>
        <Box>
          <IconButton
            href='/plans'
          >
            <Note/>
          </IconButton>
          <Typography
            variant='body2'
          >
            Plans
          </Typography>
        </Box>
        <Box>
          <IconButton
            href='/schedule'
          >
            <CalendarMonth/>
          </IconButton>
          <Typography
            variant='body2'
          >
            Schedule
          </Typography>
        </Box>
      </Stack>
    </aside>
  )
}