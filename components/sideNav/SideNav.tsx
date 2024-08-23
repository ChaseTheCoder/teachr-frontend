import React from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { CalendarMonth, House, Note } from '@mui/icons-material';

export default function SideNav() {

  return (
    <aside>
      <Grid container sx={{ gap: '1rem'}}>
        <Grid xs={12} item={true}>
          <Button size='small' href='/dashboard' sx={{ width: '100px'}}>
            <Box
              textAlign='center'
            >
              <House/>
              <Typography>Dashboard</Typography>
            </Box>
          </Button>
        </Grid>
        <Grid xs={12} item={true}>
          <Button size='small' href='/subject' sx={{ width: '100px'}}>
            <Box
              textAlign='center'
            >
              <Note/>
              <Typography>Subjects</Typography>
            </Box>
          </Button>
        </Grid>
        <Grid xs={12} item={true}>
          <Button size='small' href='/schedule' sx={{ width: '100px'}}>
            <Box
              textAlign='center'
            >
              <CalendarMonth/>
              <Typography>Schedule</Typography>
            </Box>
          </Button>
        </Grid>
      </Grid>
    </aside>
  )
}