'use client'

import React from 'react';
import Surface from '../components/surface/Surface';
import { Box, Button, Grid, Typography } from '@mui/material';

export default function Home() {

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <Surface>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <img
              src="path/to/your/image.jpg"
              alt="Educational Illustration"
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h1' fontSize={68} align='center' gutterBottom>
              Teachr Lounge
            </Typography>
            <Typography variant='h2' fontSize={20} align='center' gutterBottom>
              The future of lesson planning.
            </Typography>
            <Typography variant='body2' fontSize={14} align='center' paragraph>
              AI to automate the mundane,
            </Typography>
            <Typography variant='body2' fontSize={14} align='center' paragraph>
              to gain time for what can't be automated in the classroom.
            </Typography>
            <Button variant='contained' color='primary' size='large'>
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Surface>
    </Box>
  )
}