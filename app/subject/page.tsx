'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Surface from '../../components/surface/Surface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NextResponse } from 'next/server';

export default function Subject() {
  const [subject, setSubject] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
      fetch('http://localhost:8000/subject/')
      .then((res) => res.json())
      .then((subject) => {
          setSubject(subject)
          setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching subject:', error);
      });
  }, []);

  async function postSubject() {
    try {
      const res = await fetch('http://localhost:8000/subject/', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Subject',
          grade: 'Grade'
        }),
      })
      
      const data = await res.json()
      
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: SUBJECT NOT POSTED')
      console.log(err)
    }
  }

  async function deleteSubject(id: number) {
    try {
      fetch(`http://localhost:8000/subject/${id}`, {
        method: 'DELETE',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      })
      .then(async (response) => {
        const subject = await response.json();
        if (!response.ok) {
          const error = (subject && subject.message) || response.status;
          return Promise.reject(error);
        }
      })
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
    }
  }

  function showDropdownOptions(id: string) {
    document.getElementById(id).classList.toggle("hidden");
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className='space-y-3'>
      <div className='h-12 flex justify-center'>
        <div className='flex items-center hover:bg-gray'>
          <h1 className='pr-2 text-xl'>Subject</h1>
          <button 
            className='h-6 w-6 rounded-full bg-primary hover:primaryhover flex items-center justify-center'
            onClick={postSubject}
          >
            <FontAwesomeIcon icon={faPlus} style={{color: 'fff'}}/>
          </button>
        </div>
      </div>
      { subject.length > 0 ?
        subject.map((subject, index) => (
          <Surface key={index}>
            <div className='flex justify-between items-center pb-2 z-0'>
              <h2  className='text-lg font-semibold'>{subject.grade}, {subject.subject}</h2>
              <div className="relative inline-block text-left">
                <div>
                  <button onClick={() => showDropdownOptions(`options-${index}`)} type="button" className="inline-flex flex items-center w-full justify-center hover:bg-background" id="menu-button" aria-expanded="true" aria-haspopup="true">
                    Edit <FontAwesomeIcon icon={faEllipsisVertical} className='pl-2'/>
                  </button>
                </div>
                <div className="hidden absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-surface shadow-lg border border-primary focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" id={`options-${index}`}>
                  <div className="py-1" role="none">
                    <button onClick={() => deleteSubject(subject.id)} className="text-gray-700 block px-4 py-2 text-sm hover:bg-background" role="menuitem" id="menu-item-0">Edit</button>
                    <button onClick={() => deleteSubject(subject.id)} className="text-gray-700 block px-4 py-2 text-sm hover:bg-background" role="menuitem" id="menu-item-1">Delete</button>
                  </div>
                </div>
              </div>

            </div>
            { subject.units.map((unit, index) => (
              <div key={index} className='border-t-2 border-border py-2'>
                <Link href={`/subject/${unit.id}`} className='flex justify-between items-center'>
                  <p>{unit.title}</p>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Link>
              </div>
            ))}
          </Surface>
        )) :
        <p>No subject data</p>
      }
    </div>
  )
}