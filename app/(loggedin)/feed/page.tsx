'use client'

import React from 'react';
import { Grid } from '@mui/material';
import InfiniteFeed from './feed-infinite';
import Popular from './popular';

export default function Home() {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9} order={{ xs: 2, sm: 2, md: 1 }}>
        <InfiniteFeed/>
      </Grid>
      <Grid item xs={12} md={3} order={{ xs: 1, sm: 1, md: 2 }}>
        <Popular/>
      </Grid>
    </Grid>
  );
}
