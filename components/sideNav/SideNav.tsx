import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faNoteSticky, faCalendar
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

export default function SideNav() {

  return (
    <aside>
      <Grid container sx={{ gap: '1rem'}}>
        <Grid xs={12}>
          <Button size='small' href='/' sx={{ width: '100px'}}>
            <Box
              textAlign='center'
            >
              <FontAwesomeIcon icon={faHouse}/>
              <Typography>Home</Typography>
            </Box>
          </Button>
        </Grid>
        <Grid xs={12}>
          <Button size='small' href='/subject' sx={{ width: '100px'}}>
            <Box
              textAlign='center'
            >
              <FontAwesomeIcon icon={faNoteSticky}/>
              <Typography>Subjects</Typography>
            </Box>
          </Button>
        </Grid>
        <Grid xs={12}>
          <Button size='small' href='/schedule' sx={{ width: '100px'}}>
            <Box
              textAlign='center'
            >
              <FontAwesomeIcon icon={faCalendar}/>
              <Typography>Schedule</Typography>
            </Box>
          </Button>
        </Grid>
      </Grid>
    </aside>
  )
}