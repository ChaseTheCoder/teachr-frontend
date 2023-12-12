import React from 'react';
import Surface from './surface/Surface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function Reminders() {

  return (
    <div className='pt-16 pr-8'>
      <Surface>
        <div className='space-y-2'>
          <h3 className='font-bold'>Reminders</h3>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faCircle} size='2xs' style={{color: '#ad0000',}} />
            <p className='pl-2'>Make Angles poster</p>
          </div>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faCircle} size='2xs' style={{color: '#ad0000',}} />
            <p className='pl-2'>Get glue</p>
          </div>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faCircleCheck} size='2xs' style={{color: '#008f0a',}} />
            <p className='pl-2'>Classroom Newsletter</p>
          </div>
        </div>
      </Surface>
    </div>
  )
}