'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../../components/surface/Surface';
import CKeditor from '../../../../components/CKeditor';
import { lessonAi } from './lessonAi';
import { Box, Button, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, Skeleton, TextField, Typography } from '@mui/material';
import { AutoAwesome, ControlPoint, DeleteOutline, MoreVert, Update } from '@mui/icons-material';
import { NextResponse } from 'next/server';

interface ILessonData {
  id: number;
  title: string;
  objective: string;
  standard: string;
  materials: any;
  lesson_outline: any;
  body: string;
}

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
};

export default function Unit({
  params,
}: {
  params: { lessonId: string, unitId: string };
}) {
  const url = `http://localhost:8000/lessonplan/${params.lessonId}/`;
  const urlMaterial = 'http://localhost:8000/material/'
  let update = {}
  const [loadingLesson, setLoadingLesson] = useState<Boolean>(true)
  const [lesson, setLesson] = useState<any>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [objective, setObjective] = useState<string>(null);
  const [standard, setStandard] = useState<string>(null);
  const [body, setBody] = useState<string | null>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [openModal, setOpenModel] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [materailTitle, setMaterailTitle] = useState('');
  const [materailLink, setMaterailLink] = useState('');
  const [disableMaterail, setDisableMaterail] = useState(true);
  const [modelContent, setModelContent] = useState<null | 'CREATE' | 'UPDATE' | 'DELETE'>(null);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => {
    setOpenModel(false);
    setModelContent(null);
  }

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  async function getLesson() {
    setLoadingLesson(true)
    try {
      fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data)
        setTitle(data.title)
        setObjective(data.objective)
        setStandard(data.standard)
        setBody(data.body)
        setLoadingLesson(false)
      })
    } catch (error) {
      setLoadingLesson(false)
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getLesson()
  }, []);

  useEffect(() => {
    if(lesson !== null) {
      if(title !== lesson.title) update['title'] = title;
      if(title == lesson.title) delete update['title'];
      if(objective !== lesson.objective) update['objective'] = objective;
      if(objective == lesson.objective) delete update['objective'];
      if(standard !== lesson.standard) update['standard'] = standard;
      if(standard == lesson.standard) delete update['standard'];
      if(body !== lesson.body) update['body'] = body;
      if(body == lesson.body) delete update['body'];
    }
  }, [title, objective, standard, body, update, lesson]);

  useEffect(() => {
    if(materailTitle !== '' && materailLink !== '') setDisableMaterail(false);
  }, [materailTitle, materailLink])

  useEffect(() => {
    Object.keys(update).length > 0 ? setDisableUpdate(false) : setDisableUpdate(true);
  }, [update]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const patchLesson = () => {
    fetch(url, {      
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 
        JSON.stringify(update),
    })
    .then(
      (response) => response.json()
    )
    .finally(() => {
      update = {}
    })
    .catch(error => console.log(error))
  }

  async function postMaterail() {
    try {
      const res = await fetch(urlMaterial, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: materailTitle,
          link: materailLink,
          lesson_plan: lesson.id
        }),
      })
      const data = await res.json()
      return NextResponse.json(data)
    } catch (err) {
      console.log('ERROR: MATERAIL NOT POSTED')
      console.log(err)
    } finally {
      setMaterailTitle('')
      setMaterailLink('')
      getLesson()
      handleClose()
    }
  }

  useEffect(() => {
    postMaterail();
  }, []);

  const patchMaterail = (id: number) => {
    fetch(`${urlMaterial}${id}/`, {      
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 
        JSON.stringify({
          title: materailTitle,
          link: materailLink,
        }),
    })
    .then(
      (response) => response.json()
    )
    .finally(() => {
      setMaterailTitle('')
      setMaterailLink('')
      getLesson()
      handleClose()
    })
    .catch(error => console.log(error))
  }

  const deleteMaterial = (id: number) => {
    fetch(`${urlMaterial}${id}/`, {      
      method: 'DELETE'
    })
    .then((response) => {
      response.json();
      getLesson()
      handleClose()
    })
    .catch(error => console.log(error))
  }

  async function updateObjectiveAi(prompt: string) {
    const promptResponse = await lessonAi(prompt);
    setObjective(promptResponse);
  }

  async function updateLessonOutlineAi(prompt: string) {
    const promptFinal = 'Write a lesson plan based on the following information: ' + prompt;
    const promptResponse = await lessonAi(promptFinal);
    setBody(promptResponse);
  }

  async function deleteLesson(id: string) {
    window.alert('deleted');
  }

  return (
    <Box sx={{paddingTop: '4rem', display: 'flex-column', gap: '3rem'}}>
      <Surface>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {title !== null ?
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
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '10px' }}>
              <Typography sx={{fontWeight: 'bold'}}>Objective</Typography>
              <IconButton 
                size='small'
                color='secondary'
                onClick={() => updateObjectiveAi(objective)}
              >
                <AutoAwesome sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            {objective !== null ?
              <TextField
                size='small'
                fullWidth
                multiline
                value={objective}
                onChange={e => setObjective(e.target.value)}
              /> :
              <Skeleton />
            }
          </Box>
          <Box>
            <Typography sx={{fontWeight: 'bold'}}>Standards</Typography>
            {standard !== null ?
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
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '10px' }}>
              <Typography sx={{fontWeight: 'bold'}}>Lesson Outline</Typography>
              <IconButton 
                size='small'
                color='secondary'
                onClick={() => updateLessonOutlineAi(body)}
              >
                <AutoAwesome sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            {editorLoaded ?
              <CKeditor
                name="description"
                onChange={(data) => {
                  setBody(data);
                } }
                editorLoaded={editorLoaded}
                value={body}
              /> :
              <Skeleton height={118} />
            }
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
            <Button
              variant='contained'
              disabled={disableUpdate}
              size='small'
              onClick={patchLesson}
            >
              Update
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              onClick={() => deleteLesson(params.lessonId)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Surface>

      <Surface>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='h2' sx={{fontWeight: 'bold', fontSize: '24px'}}>Digital Materials</Typography>
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
        { lesson ?
          (lesson.materials && lesson.materials.length > 0) &&
            <List>
              {
                lesson.materials.map((material) => (
                  <>
                    <ListItem key={material.id} disablePadding>
                      <ListItemButton 
                        href={material.link}
                        target='_blank'
                        sx={{ padding: 0 }}
                      >
                        <ListItemText primary={material.title}/>
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
                            <Button color='error' startIcon={<DeleteOutline />} onClick={() => deleteMaterial(material.id)}>
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
                                value={materailTitle}
                                onChange={e => setMaterailTitle(e.target.value)}
                              />
                              <TextField
                                label='Link'
                                size='small'
                                fullWidth
                                multiline
                                value={materailLink}
                                onChange={e => setMaterailLink(e.target.value)}
                              />
                              {modelContent === 'CREATE' &&
                                <Button
                                  color='error'
                                  disabled={disableMaterail}
                                  onClick={() => postMaterail()}
                                >
                                  Add New Material
                                </Button>
                              }
                              {modelContent === 'UPDATE' &&
                                <Button
                                color='error'
                                disabled={disableMaterail}
                                onClick={() => patchMaterail(material.id)}
                                >
                                  Update
                                </Button>
                              }
                            </Box>
                          </>
                        }
                        <Button startIcon={<DeleteOutline />} onClick={() => {
                          setMaterailTitle('')
                          setMaterailLink('')
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
                                setMaterailTitle(material.title)
                                setMaterailLink(material.link)
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
                  </>
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