import { Box } from '@mui/material';
import React from 'react';

export default function Surface({children}) {

  return (
    <Box
      sx={{ padding: 2, marginBottom: 1.5, borderRadius: 4, bgcolor: '#ffffff' }}
    >
      {children}
    </Box>
  )
}