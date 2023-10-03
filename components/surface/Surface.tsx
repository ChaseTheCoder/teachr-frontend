import React from 'react';

export default function Surface({children}) {

  return (
    <div className='bg-surface drop-shadow-xl rounded-2xl'>
      <div className='p-5'>
        {children}
      </div>
    </div>
  )
}