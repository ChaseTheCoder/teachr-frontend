'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Surface from '../../components/surface/Surface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NextResponse } from 'next/server';
import { Box, IconButton, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ControlPoint, MoreVert } from '@mui/icons-material';

export default function Subject() {
  const urlSubjects = 'http://localhost:8000/subject/';
  const [subject, setSubject] = useState<any | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  async function getSubjects() {
    setLoading(true)
    try {
      fetch(urlSubjects)
      .then((res) => res.json())
      .then((subject) => {
        setSubject(subject)
        setLoading(false)
      })
    } catch (err) {
      setLoading(false)
      setError(true)
    }
  }

  useEffect(() => {
    getSubjects() 
  }, []);

  async function postSubject() {
    try {
      const res = await fetch(urlSubjects, {
        method: 'POST',
        headers: {
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
    } finally {
      getSubjects()
    }
  }
  
  async function deleteSubject(id: number) {
    try {
      fetch(`${urlSubjects}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(async (response) => {
        const subject = await response.json();
        if (response.ok) {
          getSubjects()
        } else {
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

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <p>Loading...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='space-y-3'>
        <p>Error. Try again...</p>
      </div>
    )
  }

  return (
    <>
    <Box sx={{ paddingTop: '4rem', display: 'flex-column' }}>
      {subject !== null && (
        subject.map((subject) => (
          <Surface key={subject.id}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant='h2' sx={{fontWeight: 'bold', fontSize: '22px'}}>{subject.subject}</Typography>
              <IconButton
                size='small'
                // onClick={() => {
                //   setModelContent('CREATE')
                //   handleOpen()
                // }}
              >
                <ControlPoint/>
              </IconButton>
            </Box>
            { subject.units.map((unit, index) => (
              <ListItem key={unit.id} disablePadding>
                <ListItemButton 
                  href={`/subject/${unit.id}`}
                  sx={{ padding: 0 }}
                >
                  <ListItemText primary={unit.title}/>
                </ListItemButton>
                <IconButton 
                  aria-label='options'
                  size='small'
                  // onClick={handleClick('top-end')}
                >
                  <MoreVert fontSize="inherit" />
                </IconButton>
              </ListItem>
            ) )}
          </Surface>
        ))
      )}
    </Box>

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
            <div className='flex justify-between items-center pb-2 relative'>
              <h2  className='text-lg font-semibold'>{subject.grade}, {subject.subject}</h2>
              <div className="relative inline-block text-left">
                <div>
                  <button onClick={() => showDropdownOptions(`options-${index}`)} type="button" className="inline-flex flex items-center w-full justify-center hover:bg-background" id="menu-button" aria-expanded="true" aria-haspopup="true">
                    Edit <FontAwesomeIcon icon={faEllipsisVertical} className='pl-2'/>
                  </button>
                </div>
                <div className="hidden absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-surface shadow-lg border border-primary focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" id={`options-${index}`}>
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
    </>
  )
}