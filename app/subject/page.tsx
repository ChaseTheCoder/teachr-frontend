'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../components/surface/Surface';
import { NextResponse } from 'next/server';
import { Box, Button, IconButton, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ControlPoint, MoreVert } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
    <Box sx={{ display: 'flex-column' }}>
      <Box display='flex' justifyContent='center'>
        <Button
          component="label"
          role={undefined}
          startIcon={<AddCircleOutlineIcon />}
          onClick={postSubject}
        >
          Subject
        </Button>
      </Box>
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
    </>
  )
}