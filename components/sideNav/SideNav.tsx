import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faNoteSticky, faCalendar
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export default function SideNav() {

  return (
    <aside className='pt-16'>
      <ul className='space-y-3'>
        <li className='bg-surface drop-shadow-md rounded-r-2xl hover:drop-shadow-xl p-4'>
          <Link href='/' className='ml-5 target:underline'>
            <FontAwesomeIcon icon={faHouse} className='pr-3'/>
            Home
          </Link>
        </li>
        <li className='bg-surface drop-shadow-md rounded-r-2xl hover:drop-shadow-xl p-4'>
          <Link href='/plan' className='ml-5'>
            <FontAwesomeIcon icon={faNoteSticky} className='pr-3'/>
            Plans
          </Link>
        </li>
        <li className='bg-surface drop-shadow-md rounded-r-2xl hover:drop-shadow-xl p-4'>
          <Link href='/calendar' className='ml-5'>
            <FontAwesomeIcon icon={faCalendar} className='pr-3'/>
            Schedule
          </Link>
        </li>
      </ul>
    </aside>
  )
}