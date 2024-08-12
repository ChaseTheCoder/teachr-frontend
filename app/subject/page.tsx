'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../components/surface/Surface';
import { NextResponse } from 'next/server';
import { Box, Button, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, TextField, Typography } from '@mui/material';
import { DeleteOutline, MoreVert, Update } from '@mui/icons-material';
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
  const [subjectTitle, setSubjectTitle] = useState(null);
  const [subjectGrade, setSubjectGrade] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [unitTitle, setUnitTitle] = useState(null);
  const [unitId, setUnitId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [anchorElSubject, setAnchorElSubject] = React.useState<HTMLButtonElement | null>(null);
  const [openSubject, setOpenSubject] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [placementSubject, setPlacementSubject] = React.useState<PopperPlacementType>();

  const createSubectButton = 'Create New Subject';
  const deleteSubjectButton = 'Confirm Deleting Subject and Units it has?';
  const updateSubjectButton = 'Update Subject';
  const deleteUnitButton = 'Confirm Deleting Unit and Lessons it Contains?';
  const createUnitButton = 'Create New Unit';
  const updateUnitButton = 'Update Unit';
  const [label1, setLabel1] = useState(null);
  const [value1, setValue1] = useState(null);
  const [label2, setLabel2] = useState(null);
  const [value2, setValue2] = useState(null);
  const [buttonTitle, setButtonTitle] = useState(null);

  const handleOpen = (type: string) => {
    // setModalContent(type);
    setOpenModal(true)
  }
  const handleClose = () => {
    setLabel1(null)
    setValue1(null)
    setLabel2(null)
    setValue2(null)
    setButtonTitle(null)
    setSubjectId(null)
    setOpenModal(false)
    setUnitId(null)
    setUnitTitle(null)
    setSubjectId(null)
    setSubjectTitle(null)
    setSubjectGrade(null)
  };

  const handleClickUnit = (
    newPlacement: PopperPlacementType,
    unitId: number,
    title: string
  ) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setUnitId(unitId)
      setUnitTitle(title)
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
  };

  const handleClickSubject = (
    newPlacementSubject: PopperPlacementType,
    subjectId: number,
    title: string,
    grade: string
  ) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setSubjectId(subjectId)
      setSubjectTitle(title)
      setSubjectGrade(grade)
      setAnchorElSubject(event.currentTarget);
      setOpenSubject((prev) => placementSubject !== newPlacementSubject || !prev);
      setPlacementSubject(newPlacementSubject);
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
    try {
      const res = await fetch(urlSubjects, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: value1,
          grade: value2
        }),
      })
      
      const data = await res.json()
      
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: SUBJECT NOT POSTED')
      console.log(err)
    } finally {
      getSubjects()
      handleClose()
    }
  }

  async function updateSubject() {
    try {
      const res = await fetch(`${urlSubjects}${subjectId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: value1,
          grade: value2
        }),
      })
      const data = await res.json()
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: SUBJECT NOT PATCHED')
      console.log(err)
    } finally {
      getSubjects()
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
          title: value1,
          subject: subjectId
        }),
      })
      
      const data = await res.json()
      
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: UNIT NOT POSTED')
      console.log(err)
    } finally {
      handleClose()
    }
  }
  

  async function updateUnit() {
    try {
      const res = await fetch(`${urlUnit}${unitId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: value1
        }),
      })
      
      const data = await res.json()
      
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: UNIT NOT PATCHED')
      console.log(err)
    } finally {
      getSubjects()
      handleClose()
    }
  }
  
  async function deleteSubject() {
    try {
      fetch(`${urlSubjects}${subjectId}/`, {
        method: 'DELETE',
      })
      .then(async (response) => {
        response.json();
      })
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
    } finally {
      getSubjects()
      handleClose()
    }
  }
  
  async function deleteUnit() {
    try {
      fetch(`${urlUnit}${unitId}/`, {
        method: 'DELETE',
      })
      .then(async (response) => {
        response.json()
      })
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
    } finally {
      getSubjects()
      handleClose()
    }
  }

  function modalCall() {
    if(buttonTitle === createSubectButton) {
        postSubject()
        setButtonTitle(null)
    } else if(buttonTitle === updateSubjectButton) {
        updateSubject()
        setButtonTitle(null)
    } else if(buttonTitle === deleteSubjectButton) {
        deleteSubject()
        setButtonTitle(null)
    } else if(buttonTitle === createUnitButton) {
        postUnit()
        setButtonTitle(null)
    } else if (buttonTitle === deleteUnitButton) {
        deleteUnit()
        setButtonTitle(null)
    } else if(buttonTitle === updateUnitButton) {
        updateUnit()
        setButtonTitle(null)
    } else {
        console.log("NO MODAL CALL MADE")
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
            onClick={() => {
              setLabel1('Subject Title')
              setLabel2('Grade')
              setButtonTitle(createSubectButton)
              handleOpen('CREATE-SUBJECT')
            }}
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
                  aria-label='options'
                  size='small'
                  onClick={handleClickSubject('top-end', subject.id, subject.subject, subject.grade)}
                  key={subject.id}
                >
                  <MoreVert fontSize="inherit" />
                </IconButton>
                <Popper
                  sx={{ zIndex: 1200 }}
                  open={openSubject}
                  anchorEl={anchorElSubject}
                  placement={placementSubject}
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                      <Paper>
                        <List>
                          <ListItemButton 
                            sx={{ padding: 1, gap: 3 }}
                            onClick={() => {
                              setLabel1('Unit Title')
                              setButtonTitle(createUnitButton)
                              setOpenSubject(false)
                              handleOpen('')
                            }}
                          >
                            <AddCircleOutlineIcon />   <Typography>Create Unit</Typography>
                          </ListItemButton>
                          <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => {
                            setButtonTitle(deleteSubjectButton)
                            setOpenSubject(false);
                            handleOpen('');
                          } }>
                            <DeleteOutline />   <Typography>Delete Subject</Typography>
                          </ListItemButton>
                          <ListItemButton 
                            sx={{ padding: 1, gap: 3 }}
                            onClick={() => {
                              setLabel1('Subject Title')
                              setValue1(subjectTitle)
                              setLabel2('Grade')
                              setValue2(subjectGrade)
                              setButtonTitle(updateSubjectButton)
                              setOpenSubject(false)
                              handleOpen('')
                            }}
                            key={subject.id}
                          >
                            <Update />   <Typography>Update Subject</Typography>
                          </ListItemButton>
                        </List>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
              { subject.units.map((unit) => (
                <div key={unit.id}>
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
                      onClick={handleClickUnit('top-end', unit.id, unit.title)}
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
                              setButtonTitle(deleteUnitButton)
                              setOpen(false)
                              handleOpen('')
                            } }>
                              <DeleteOutline />   <Typography>Delete</Typography>
                            </ListItemButton>
                            <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => {
                              setLabel1('Unit Title')
                              setValue1(unitTitle)
                              setButtonTitle(updateUnitButton)
                              setOpen(false)
                              handleOpen('')
                            } }>
                              <Update />   <Typography>Update</Typography>
                            </ListItemButton>
                          </List>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                </div>
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
          {label1 && (
            <TextField
              label={label1}
              size='small'
              fullWidth
              multiline
              value={value1 ?? ''}
              onChange={e => setValue1(e.target.value)}
            />
          )}
          {label2 && (
            <TextField
              label={label2}
              size='small'
              fullWidth
              multiline
              value={value2 ?? ''}
              onChange={e => setValue2(e.target.value)}
            />
          )}
          <Button
            // variant='contained'
            onClick={modalCall}
          >
            {buttonTitle}
          </Button>
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