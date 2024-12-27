'use client'

import React from 'react';
import { Grid } from '@mui/material';
import Notifications from './notifications';

export default function Home() {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <Notifications/>
      </Grid>
    </Grid>
  );
}
