'use client'

import React, {  } from 'react';
import { Button, Drawer, Grid } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';
import PlansMenu from './plansMenu';

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Grid container spacing={1} style={{ minHeight: '90vh' }}>
      <Grid item sx={{ display: { xs: 'none', md: 'block' } }} md={3}>
        <PlansMenu />
      </Grid>
      <Grid item xs={12} md={9}>
        <Button 
          color='success'
          sx={{ display: { md: 'none' }, paddingLeft: '28px' }}
          onClick={toggleDrawer(true)}
          startIcon={<MenuOpen />}
        >Plans</Button>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <PlansMenu/>
        </Drawer>
        {children}
      </Grid>
    </Grid>
  )
}