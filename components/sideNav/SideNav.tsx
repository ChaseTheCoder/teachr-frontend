import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faNoteSticky, faCalendar
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { Grid, Stack, Typography } from '@mui/material';

export default function SideNav() {

  return (
    <aside>
      <Grid container sx={{ padding: '8px', gap: '1rem'}}>
        <Grid xs={12}>
          <Link href='/'>
          <Stack>
            <FontAwesomeIcon icon={faHouse}/>
            <Typography>Home</Typography>
            
          </Stack>
          </Link>
        </Grid>
        <Grid xs={12}>
          <Link href='/subject' >
            <FontAwesomeIcon icon={faNoteSticky}/>
            Subjects
          </Link>
        </Grid>
        <Grid xs={12}>
          <Link href='/schedule' >
            <FontAwesomeIcon icon={faCalendar}/>
            Schedule
          </Link>
        </Grid>
      </Grid>
    </aside>
  )
}