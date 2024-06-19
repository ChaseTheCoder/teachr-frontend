import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faNoteSticky, faCalendar
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import Reminders from '../Reminders';
import { Box } from '@mui/material';
import Surface from '../surface/Surface';

export default function SideNav() {

  return (
    <aside>
      <Box sx={{padding: '0, 8px, 8px, 8px', gap: '3rem'}}>
        <Link href='/' className='ml-5 target:underline'>
          <Surface>
              <FontAwesomeIcon icon={faHouse}/>
              Home
          </Surface>
        </Link>
        <Surface>
          <Link href='/subject' >
            <FontAwesomeIcon icon={faNoteSticky}/>
            Subjects
          </Link>
        </Surface>
        <Surface>
          <Link href='/schedule' >
            <FontAwesomeIcon icon={faCalendar}/>
            Schedule
          </Link>
        </Surface>
        <Reminders />
      </Box>
    </aside>
  )
}