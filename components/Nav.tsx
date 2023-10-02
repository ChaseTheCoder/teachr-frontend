import React from 'react';

export default function Nav() {

  return (
  <nav className='bg-surface drop-shadow-md'>
    <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
      <a href='#' className='flex items-center'>
          <p>Teacher Lounge</p>
      </a>
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