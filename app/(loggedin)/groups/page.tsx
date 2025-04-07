'use client'

import React from 'react';
import { Grid } from '@mui/material';
import GroupList from './groupList';

export default function groups() {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <GroupList />
      </Grid>
      {/* <Grid item xs={12} md={3}>
        <Popular/>
      </Grid> */}
    </Grid>
  );
}
