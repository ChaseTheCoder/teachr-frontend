'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../components/surface/Surface';
import { NextResponse } from 'next/server';
import { Box, Button, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, TextField, Typography } from '@mui/material';
import { ControlPoint, DeleteOutline, MoreVert, Update } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  radius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

export default function Subject() {
  const urlSubjects = 'http://localhost:8000/subject/';
  const urlUnit = 'http://localhost:8000/unitplan/';
  const [subject, setSubject] = useState<any | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState('');
  const [subjectGrade, setSubjectGrade] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleOpen = (type: string) => {
    setModalContent(type);
    setOpenModal(true)
  }
  const handleClose = () => {
    setModalContent('')
    setSubjectTitle('')
    setSubjectGrade('')
    setUnitTitle('')
    setOpenModal(false)
  };

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
  };

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
    subjectTitle ?? setSubjectTitle('Subject');
    subjectGrade ?? setSubjectGrade('Subject');
    try {
      const res = await fetch(urlSubjects, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subjectTitle,
          grade: subjectGrade
        }),
      })
      
      const data = await res.json()
      
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: SUBJECT NOT POSTED')
      console.log(err)
    } finally {
      getSubjects()
      setSubjectTitle('')
      setSubjectGrade('')
      handleClose()
    }
  }

  async function postUnit() {
    try {
      const res = await fetch(urlUnit, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: unitTitle,
          subject: subjectId
        }),
      })
      
      const data = await res.json()
      
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: UNIT NOT POSTED')
      console.log(err)
    } finally {
      getSubjects()
      setUnitTitle('')
      handleClose()
    }
  }
  
  async function deleteSubject(id: number) {
    subjectTitle ?? setSubjectTitle('Subject');
    subjectGrade ?? setSubjectGrade('Subject');
    try {
      fetch(`${urlSubjects}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "subject": subjectTitle,
          "grade": subjectGrade
        })
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
            onClick={() => handleOpen('CREATE-SUBJECT')}
          >
            Subject
          </Button>
        </Box>
        {subject !== null && (
          subject.map((subject) => (
            <Surface key={subject.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant='h2' sx={{fontWeight: 'bold', fontSize: '22px'}}>{subject.grade}, {subject.subject}</Typography>
                <IconButton
                  size='small'
                  onClick={() => {
                    setSubjectId(subject.id)
                    handleOpen('CREATE-UNIT')
                  }}
                >
                  <ControlPoint/>
                </IconButton>
              </Box>
              { subject.units.map((unit, index) => (
                <>
                  <ListItem key={unit.id} disablePadding>
                    <ListItemButton
                      href={`/subject/${unit.id}`}
                      sx={{ padding: 0 }}
                    >
                      <ListItemText primary={unit.title} />
                    </ListItemButton>
                    <IconButton
                      aria-label='options'
                      size='small'
                    >
                      <MoreVert fontSize="inherit" />
                    </IconButton>
                  </ListItem>
                  <Popper
                    sx={{ zIndex: 1200 }}
                    open={open}
                    anchorEl={anchorEl}
                    placement={placement}
                    transition
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                          <List>
                            <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => {
                              setSubjectId(subject.id);
                              setOpen(false);
                              handleOpen('DELETE-UNIT');
                            } }>
                              <DeleteOutline />   <Typography>Delete</Typography>
                            </ListItemButton>
                            <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => {
                              setUnitTitle(unit.title);
                              setSubjectId(unit.id);
                              setOpen(false);
                              handleOpen('UPDATE-UNIT');
                            } }>
                              <Update />   <Typography>Update</Typography>
                            </ListItemButton>
                          </List>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                </>
              ) )}
            </Surface>
          ))
        )}
      </Box>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          { modalContent === 'CREATE-SUBJECT' && (
            <>
              <TextField
                label='Subject Title'
                size='small'
                fullWidth
                multiline
                value={subjectTitle}
                onChange={e => setSubjectTitle(e.target.value)}
              />
              <TextField
                label='Grade'
                size='small'
                fullWidth
                multiline
                value={subjectGrade}
                onChange={e => setSubjectGrade(e.target.value)}
              />
              <Button
                // variant='contained'
                onClick={postSubject}
              >
                Add New Unit
              </Button>
            </>
          )}
          { modalContent === 'CREATE-UNIT' && (
            <>
              <TextField
                label='Unit Title'
                size='small'
                fullWidth
                multiline
                value={unitTitle}
                onChange={e => setUnitTitle(e.target.value)}
              />
              <Button
                onClick={postUnit}
              >
                Add New Unit
              </Button>
            </>
          )}
          { modalContent === 'CREATE-UNIT' && (
            <>
              <TextField
                label='Unit Title'
                size='small'
                fullWidth
                multiline
                value={unitTitle}
                onChange={e => setUnitTitle(e.target.value)}
              />
              <Button
                onClick={postUnit}
              >
                Add New Unit
              </Button>
            </>
          )}
          <Button
            color='error'
            startIcon={<DeleteOutline />} 
            onClick={() => {
              handleClose()
            }}
          >
            Cancle
          </Button>
        </Box>
      </Modal>
    </>
  )
}