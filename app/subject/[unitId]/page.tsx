'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../components/surface/Surface';
import { Box, Button, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, Skeleton, TextField, Typography } from '@mui/material';
import { ControlPoint, DeleteOutline, MoreVert, Update } from '@mui/icons-material';
import { NextResponse } from 'next/server';

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

export default function Unit({
  params,
}: {
  params: { unitId: string };
}) {
  const url = 'http://localhost:8000/api/unitplan/' + params.unitId;
  const urlResource = 'http://localhost:8000/resource/'
  const urlLesson = 'http://localhost:8000/lessonplan/'
  const [loadingUnit, setLoadingUnit] = useState<Boolean>(true)
  const [unit, setUnit] = useState<any>();
  const [lessons, setLessons] = useState<any>();
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [title, setTitle] = useState<string | null>(null);
  const [overview, setOverview] = useState<string | null>(null);
  const [standard, setStandard] = useState<string | null>(null);
  const [resources, setResources] = useState<any>(null);
  const [resourceTitle, setResourceTitle] = useState<string | null>('');
  const [resourceLink, setResourceLink] = useState<string | null>('');
  const [disableResource, setDisableResource] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [openModal, setOpenModel] = useState(false);
  const [modelContent, setModelContent] = useState<null | 'CREATE' | 'UPDATE' | 'DELETE'>(null);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => {
    setOpenModel(false);
    setModelContent(null);
  }
  const [openLesson, setOpenLesson] = React.useState(false);
  const [anchorElLesson, setAnchorElLesson] = React.useState<HTMLButtonElement | null>(null);
  const [openModalLesson, setOpenModelLesson] = useState(false);
  const [modelContentLesson, setModelContentLesson] = useState<null | 'CREATE' | 'DELETE'>(null);
  const handleOpenLesson = () => setOpenModelLesson(true);
  const handleCloseLesson = () => {
    setOpenModelLesson(false);
    setModelContentLesson(null);
  }

  const handleClickLesson =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElLesson(event.currentTarget);
      setOpenLesson((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  async function getUnit() {
    setLoadingUnit(true)
    try {
      fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setUnit(data)
        setTitle(data.title)
        setOverview(data.overview)
        setStandard(data.standard)
        setResources(data.resources)
        setLessons(data.lessons)
        setLoadingUnit(false)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingUnit(false)
    }
  }

  useEffect(() => {
    if(resourceTitle !== '' && resourceLink !== '') setDisableResource(false);
  }, [resourceTitle, resourceLink])

  async function patchResource(id: number) {
    fetch(`${urlResource}${id}/`, {      
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 
        JSON.stringify({
          title: resourceTitle,
          link: resourceLink,
        }),
    })
    .then(
      (response) => response.json()
    )
    .finally(() => {
      setResourceTitle('')
      setResourceLink('')
      getUnit()
      handleClose()
    })
    .catch(error => console.log(error))
  }

  async function postResource() {
    try {
      const res = await fetch(urlResource, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: resourceTitle,
          link: resourceLink,
          unit_plan: unit.id
        }),
      })
      const data = await res.json()
      console.log(data)
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: RESOURCE NOT POSTED')
      console.log(err)
    } finally {
      setResourceTitle('')
      setResourceLink('')
      getUnit()
      handleClose()
    }
  }

  useEffect(() => {
    postResource();
  }, []);

  const deleteResource = (id: number) => {
    fetch(`${urlResource}${id}/`, {      
      method: 'DELETE'
    })
    .then((response) => {
      response.json();
      getUnit()
      handleClose()
    })
    .catch(error => console.log(error))
  }

  async function postLesson() {
    try {
      const res = await fetch(urlLesson, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: lessonTitle,
          standard: '',
          objective: '',
          unit_plan: unit.id
        }),
      })
      const data = await res.json()
      console.log(data)
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: LESSON NOT POSTED')
      console.log(err)
    } finally {
      setLessonTitle('')
      getUnit()
      handleCloseLesson()
    }
  }

  const deleteLesson = (id: number) => {
    fetch(`${urlLesson}${id}/`, {      
      method: 'DELETE'
    })
    .then((response) => {
      response.json();
      getUnit()
      handleCloseLesson()
    })
    .catch(error => console.log(error))
  }

  return (
    <Box sx={{ display: 'flex-column' }}>
      <Surface>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {title ?
            <TextField
              variant='standard'
              multiline
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              inputProps={{style: {fontWeight: 'bold', fontSize: 24}}} // font size of input text
              InputLabelProps={{style: {fontWeight: 'bold'}}} // font size of input label
            /> :
            <Skeleton />
          }
        </Box>
        <Box>
          <Typography sx={{fontWeight: 'bold'}}>Overview</Typography>
          {overview ?
            <TextField
              size='small'
              fullWidth
              multiline
              value={overview}
              onChange={e => setOverview(e.target.value)}
            /> :
            <Skeleton />
          }
        </Box>
        <Box>
          <Typography sx={{fontWeight: 'bold'}}>Standards</Typography>
          {standard ?
            <TextField
              size='small'
              fullWidth
              multiline
              value={standard}
              onChange={e => setStandard(e.target.value)}
            /> :
            <Skeleton />
          }
        </Box>

      </Surface>

      <Surface>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='h2' sx={{fontWeight: 'bold', fontSize: '24px'}}>Resources</Typography>
          <IconButton
            size='small'
            onClick={() => {
              setModelContent('CREATE')
              handleOpen()
            }}
          >
            <ControlPoint/>
          </IconButton>
        </Box>
        { resources ?
          (resources.length > 0) &&
            <List>
              {
                resources.map((resource) => (
                  <div key={resource.id}>
                    <ListItem disablePadding>
                      <ListItemButton 
                        href={resource.link}
                        target='_blank'
                        sx={{ padding: 0 }}
                      >
                        <ListItemText primary={resource.title}/>
                      </ListItemButton>
                      <IconButton 
                        aria-label='options'
                        size='small'
                        onClick={handleClick('top-end')}
                      >
                        <MoreVert fontSize="inherit" />
                      </IconButton>
                    </ListItem>
                    <Modal
                      open={openModal}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        {modelContent === 'DELETE' &&
                          <>
                            <Typography variant="h6" component="h2">
                              Delete forever?
                            </Typography>
                            <Button color='error' startIcon={<DeleteOutline />} onClick={() => deleteResource(resource.id)}>
                              Delete
                            </Button>
                          </>
                        }
                        {(modelContent === 'CREATE' || modelContent === 'UPDATE') &&
                          <>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                              <TextField
                                label='Title'
                                size='small'
                                fullWidth
                                multiline
                                value={resourceTitle}
                                onChange={e => setResourceTitle(e.target.value)}
                              />
                              <TextField
                                label='Link'
                                size='small'
                                fullWidth
                                multiline
                                value={resourceLink}
                                onChange={e => setResourceLink(e.target.value)}
                              />
                              {modelContent === 'CREATE' &&
                                <Button
                                  color='error'
                                  disabled={disableResource}
                                  onClick={() => postResource()}
                                >
                                  Add New Resource
                                </Button>
                              }
                              {modelContent === 'UPDATE' &&
                                <Button
                                color='error'
                                disabled={disableResource}
                                onClick={() => patchResource(resource.id)}
                                >
                                  Update
                                </Button>
                              }
                            </Box>
                          </>
                        }
                        <Button startIcon={<DeleteOutline />} onClick={() => {
                          setResourceTitle('')
                          setResourceLink('')
                          handleClose()
                        }}
                          >
                          Cancle
                        </Button>
                      </Box>
                    </Modal>
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
                                setModelContent('DELETE')
                                setOpen(false)
                                handleOpen()}}>
                                <DeleteOutline/>   <Typography>Delete</Typography>
                              </ListItemButton>
                              <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => {
                                setResourceTitle(resource.title)
                                setResourceLink(resource.link)
                                setModelContent('UPDATE')
                                setOpen(false)
                                handleOpen()
                              }}>
                                <Update/>   <Typography>Update</Typography>
                              </ListItemButton>
                            </List>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </div>
                ))
              }
            </List>
          :
          <Skeleton />
        }
      </Surface>

      <Surface>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='h2' sx={{fontWeight: 'bold', fontSize: '24px'}}>Lessons</Typography>
          <IconButton
            size='small'
            onClick={() => {
              setModelContentLesson('CREATE')
              handleOpenLesson()
            }}
          >
            <ControlPoint/>
          </IconButton>
        </Box>
        { lessons ?
          (lessons.length > 0) &&
            <List key='lesson-key'>
              {
                lessons.map((lesson) => (
                    <ListItem key={lesson.id} disablePadding>
                      <ListItemButton 
                        href={`/subject/${unit.id}/${lesson.id}/`}
                        sx={{ padding: 0 }}
                      >
                        <ListItemText primary={lesson.title}/>
                      </ListItemButton>
                      <IconButton 
                        aria-label='options'
                        size='small'
                        onClick={handleClickLesson('top-end')}
                      >
                        <MoreVert fontSize="inherit" />
                      </IconButton>
                      <Modal
                        open={openModalLesson}
                        onClose={handleCloseLesson}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          {modelContentLesson === 'DELETE' &&
                            <>
                              <Typography variant="h6" component="h2">
                                Delete forever?
                              </Typography>
                              <Button color='error' startIcon={<DeleteOutline />} onClick={() => deleteLesson(lesson.id)}>
                                Delete
                              </Button>
                            </>
                          }
                          {modelContentLesson === 'CREATE' &&
                            <TextField
                              label='Title'
                              size='small'
                              fullWidth
                              multiline
                              value={lessonTitle}
                              onChange={e => setLessonTitle(e.target.value)}
                            />
                          }
                          {modelContentLesson === 'CREATE' &&
                            <Button
                              color='error'
                              onClick={() => postLesson()}
                            >
                              Add New Lesson
                            </Button>
                          }
                          <Button startIcon={<DeleteOutline />} onClick={() => {
                            setLessonTitle('')
                            handleCloseLesson()
                          }}
                          >
                            Cancle
                          </Button>
                        </Box>
                      </Modal>
                      <Popper
                        sx={{ zIndex: 1200 }}
                        open={openLesson}
                        anchorEl={anchorElLesson}
                        placement={placement}
                        transition
                      >
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper>
                              <List>
                                <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => {
                                  setModelContentLesson('DELETE')
                                  setOpenLesson(false)
                                  handleOpenLesson()}}>
                                  <DeleteOutline/>   <Typography>Delete</Typography>
                                </ListItemButton>
                              </List>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </ListItem>
                ))
              }
            </List>
          :
          <Skeleton />
        }
      </Surface>
    </Box>
  )
}