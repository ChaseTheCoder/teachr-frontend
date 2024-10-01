'use client'

import React from 'react';
import Surface from '../../../components/surface/Surface';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {

  return (
    <Box sx={{ paddingTop: '12px' }}  style={{ minHeight: '90vh' }}>
      <Surface>
        <Typography variant='h1' fontSize={68} align='center'>
          Teachr Lounge
        </Typography>
        <Typography variant='h2' fontSize={48} align='center'>
          Dashboard
        </Typography>
        <Typography sx={{ padding: '32px' }} >
          Here you will eventurally see an ouline of all your classes for the current day, materails for the day that you need to print, and any other important information. We are also open to feedback to what teachers want to see on their dashboard to help them prepare for the day.
        </Typography>
      </Surface>
    </Box>
  )
}