import React from 'react';

export default function Reminders({children}) {

  return (
    <div className='px-1 border-2 border-border rounded-md'>
        {children}
    </div>
  )
}