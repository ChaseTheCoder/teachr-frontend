'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../../components/surface/Surface';
import CKeditor from '../../../../components/CKeditor';
import { lessonAi } from './lessonAi';
import { Box, Button, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, Skeleton, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
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
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

export default function Unit({
  params,
}: {
  params: { lessonId: string, unitId: string };
}) {
  const url = `http://localhost:8000/lessonplan/${params.lessonId}/`;
  const urlMaterial = 'http://localhost:8000/material/';
  const [loadingLesson, setLoadingLesson] = useState<Boolean>(true)
  const [update, setUpdate] = useState({})
  const [lesson, setLesson] = useState<any>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [objective, setObjective] = useState<string>(null);
  const [standard, setStandard] = useState<string>(null);
  const [body, setBody] = useState<string | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
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
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingLesson(false)
    }
  }

  useEffect(() => {
    getLesson()
  }, []);

  useEffect(() => {
    if(lesson !== null) {
      if(title !== lesson.title) setUpdate({
        ...update,
        title: title
      });
      if(objective !== lesson.objective) setUpdate({
        ...update,
        objective: objective
      });
      if(standard !== lesson.standard) setUpdate({
        ...update,
        standard: standard
      });
      if(body !== lesson.body) setUpdate({
        ...update,
        body: body
      });
    }
    Object.keys(update).length > 0 ? setDisableUpdate(false) : setDisableUpdate(true);
  }, [title, objective, standard, body, lesson]);

  useEffect(() => {
    if(materailTitle !== '' && materailLink !== '') setDisableMaterail(false);
  }, [materailTitle, materailLink])

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
    setLoadingUpdate(true);
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
    .catch(error => console.log(error))
    .finally(() => {
      setUpdate({});
      setTimeout(() => {setLoadingUpdate(false)}, 2000);
      setDisableUpdate(true);
    })
  }

  const postMaterail = () => {
    console.log(urlMaterial)
    fetch(urlMaterial, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: materailTitle,
        link: materailLink,
        lesson_plan: params.lessonId
      }),
    })
    .then(response => {
      console.log(response)
      response.json()})
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      setMaterailTitle('')
      setMaterailLink('')
      getLesson()
      handleClose()
  })
}

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
    const promptFinal = `Write a lesson plan based on the following information: ` + prompt;
    const promptResponse = await lessonAi(promptFinal);
    setBody(promptResponse);
  }

  async function deleteLesson(id: string) {
    window.alert('deleted');
  }

  return (
    <Box sx={{ display: 'flex-column', gap: '3rem' }}>
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
            {body !== null ?
              <CKeditor
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
            <LoadingButton
              variant='contained'
              disabled={disableUpdate}
              size='small'
              onClick={patchLesson}
              loading={loadingUpdate}
            >
              Update
            </LoadingButton>
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
                  <div key={material.id}>
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
                            <Typography>
                              Delete forever?
                            </Typography>
                            <Button
                              variant='contained'
                              color='error'
                              startIcon={<DeleteOutline />}
                              onClick={() => deleteMaterial(material.id)}
                            >
                              Delete
                            </Button>
                          </>
                        }
                        {(modelContent === 'CREATE' || modelContent === 'UPDATE') &&
                          <TextField
                          label='Title'
                          size='small'
                          fullWidth
                          multiline
                            value={materailTitle}
                            onChange={e => setMaterailTitle(e.target.value)}
                          />
                        }
                        {(modelContent === 'CREATE' || modelContent === 'UPDATE') &&
                          <TextField
                            label='Link'
                            size='small'
                            fullWidth
                            multiline
                            value={materailLink}
                            onChange={e => setMaterailLink(e.target.value)}
                          />
                        }
                        {modelContent === 'CREATE' &&
                          <Button
                            variant='contained'
                            disabled={disableMaterail}
                            onClick={postMaterail}
                          >
                            Add New Material
                          </Button>
                        }
                        {modelContent === 'UPDATE' &&
                          <Button
                            variant='contained'
                            disabled={disableMaterail}
                            onClick={() => patchMaterail(material.id)}
                          >
                            Update
                          </Button>
                        }
                        <Button
                          startIcon={<DeleteOutline />} 
                          onClick={() => {
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
                  </div>
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