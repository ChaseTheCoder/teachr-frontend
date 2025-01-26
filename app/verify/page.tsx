'use client'

import { Box } from '@mui/material';
import Verify from './verify';

export default function Page() {

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '90vh', width: '100%', marginTop: 2 }}>
      <Verify/>
    </Box>
  )
}

// https://www.teacher-lounge.com/verify?email=chasesheaff@teacher-lounge.com&user_id=2d770e04-bd9d-4def-9b5d-feec263cb570