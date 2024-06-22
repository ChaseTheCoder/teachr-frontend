'use client'

import React from 'react';
import Surface from '../components/surface/Surface';
import { Box, Typography } from '@mui/material';

export default function Home() {

  return (
    <Box sx={{ paddingTop: '12px' }}>
      <Surface>
        <Typography variant='h1' fontSize={68} align='center'>
          Teachr Lounge
        </Typography>
        <Typography variant='h2' fontSize={48} align='center'>
          Home Page
        </Typography>
      </Surface>
    </Box>
  )
}