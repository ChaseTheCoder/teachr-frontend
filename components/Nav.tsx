import React from 'react';
import Image from 'next/image';
import TeachrLogo from '../public/TeachrLogo.svg';
import Link from 'next/link';

export default function Nav() {

  return (
  <nav className='bg-surface drop-shadow-md'>
    <div className='flex flex-wrap items-center justify-between mx-auto py-2 px-6'>
      <Link href='/' className='flex items-center'>
          <Image
            priority
            src={TeachrLogo}
            alt='Teachr Lounge logo'
            height={38}
          />
      </Link>
      <div className='hidden w-full md:block md:w-auto' id='navbar-dropdown'>
        <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0'>
          <li>
            <a href='#' className='block py-2 pl-3 pr-4 text-black md:p-0 hover:drop-shadow-md' aria-current='page'>Hello, Mr. Smith</a>
          </li>
          <li>
            <a href='#' className='block py-2 pl-3 pr-4 text-black md:p-0 hover:drop-shadow-md' aria-current='page'>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}