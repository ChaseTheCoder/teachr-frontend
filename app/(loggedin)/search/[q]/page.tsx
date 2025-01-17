'use client'

import React from 'react';
import { Grid } from '@mui/material';
import SearchFeed from './feed-infinite';

export default function search({
  params,
}: {
  params: { q: string };
}) {
  console.log('searchqqqqq', params.q);
  const searchParam = params.q;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <SearchFeed searchParam={searchParam} />
      </Grid>
      {/* <Grid item xs={12} md={3}>
        <Popular/>
      </Grid> */}
    </Grid>
  );
}
