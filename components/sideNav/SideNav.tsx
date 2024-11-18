import React from 'react';
import { Badge, Box, IconButton, Stack, Typography } from '@mui/material';
import { CalendarMonth, House, Note, Person } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname()

  return (
    <aside>
      <Stack 
        style={{textAlign: "center", paddingTop: 12 }}
        gap={2}
      >
        <Box>
          <IconButton
            href='/dashboard'
            color={pathname === '/dashboard' ? 'success' : 'default'}
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
            color={pathname === '/plans' ? 'success' : 'default'}
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
            color={pathname === '/schedule' ? 'success' : 'default'}
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