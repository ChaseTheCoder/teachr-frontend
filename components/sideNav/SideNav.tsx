import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faNoteSticky, faCalendar
} from "@fortawesome/free-solid-svg-icons";

export default function SideNav() {

  return (
    <aside className='pt-16'>
      <ul className='space-y-3'>
        <li className='bg-surface drop-shadow-md rounded-r-2xl p-4'>
          <a href='/' className='ml-5'>
            <FontAwesomeIcon icon={faHouse} className='pr-3'/>
            Home
          </a>
        </li>
        <li className='bg-surface drop-shadow-md rounded-r-2xl p-4'>
          <a href='/plan' className='ml-5'>
            <FontAwesomeIcon icon={faNoteSticky} className='pr-3'/>
            Plans
          </a>
        </li>
        <li className='bg-surface drop-shadow-md rounded-r-2xl p-4'>
          <a href='/calendar' className='ml-5'>
            <FontAwesomeIcon icon={faCalendar} className='pr-3'/>
            Plans
          </a>
        </li>
      </ul>
    </aside>
  )
}