import { Paper } from '@mui/material';
import React from 'react';

export default function Surface({children}) {

  return (
    <Paper
      elevation={2}
      sx={{ padding: 2, marginBottom: 1.5 }}
    >
      {children}
    </Paper>
  )
}