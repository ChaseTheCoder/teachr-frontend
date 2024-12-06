'use client'

import React from 'react';
import { Grid } from '@mui/material';
import Feed from './feed';
import Popular from './popular';

export default function Home() {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <Feed/>
      </Grid>
      <Grid item xs={12} md={3}>
        <Popular/>
      </Grid>
    </Grid>
  );
}
