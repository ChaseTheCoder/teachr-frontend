import { Paper } from '@mui/material';
import React from 'react';

export default function Surface({children}) {

  return (
    <Paper
      elevation={2}
      sx={{ padding: 3, marginBottom: 3 }}
    >
      {children}
    </Paper>
  )
}