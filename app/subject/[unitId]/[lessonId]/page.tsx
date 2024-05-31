'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Surface from '../../../../components/surface/Surface';
import Textarea from '../../../../components/Textarea';
import CKeditor from '../../../../components/CKeditor';
import { lessonAi } from './lessonAi';
import { Box, Button, CircularProgress, Fade, Icon, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, Skeleton, TextField, Typography } from '@mui/material';
import { AutoAwesome, ControlPoint, DeleteOutline, MoreVert, Update } from '@mui/icons-material';
import MaterialModal from './materialModal';

interface ILessonData {
  id: number;
  title: string;
  objective: string;
  standard: string;
  materials: any;
  lesson_outline: any
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
  const [lesson, setLesson] = useState<any>('');
  const [title, setTitle] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [standard, setStandard] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [openModal, setOpenModel] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [materailTitle, setMaterailTitle] = useState('');
  const [materailLink, setMaterailLink] = useState('');
  const [modelContent, setModelContent] = useState<null | 'CREATE' | 'UPDATE' | 'DELETE'>(null);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => {
    setOpenModel(false);
    setModelContent(null);
  }

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setLesson(data);
      setTitle(data.title);
      setObjective(data.objective);
      setStandard(data.standard);
      setBody(data.body);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
  }, [url]);

  useEffect(() => {
    if(title !== lesson.title) update['title'] = title;
    if(title == lesson.title) delete update['title'];
    if(objective !== lesson.objective) update['objective'] = objective;
    if(objective == lesson.objective) delete update['objective'];
    if(standard !== lesson.standard) update['standard'] = standard;
    if(standard == lesson.standard) delete update['standard'];
    if(body !== lesson.body) update['body'] = body;
    if(body == lesson.body) delete update['body'];
    console.log(update);
  }, [title, objective, standard, body, update, lesson]);

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

  const updateLessonButton = () => {
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
      console.log(update)
      console.log('update')
    })
    .catch(error => console.log(error))
  }

  const createMaterailButton = () => {
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
      console.log(update)
      console.log('update')
    })
    .catch(error => console.log(error))
  }

  const deleteMaterial = (id: number) => {
    fetch(`${urlMaterial}${id}/`, {      
      method: 'DELETE'
    })
    .then((response) => {
      response.json();
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
          <TextField
            variant='standard'
            multiline
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            inputProps={{style: {fontWeight: 'bold', fontSize: 24}}} // font size of input text
            InputLabelProps={{style: {fontWeight: 'bold'}}} // font size of input label
          />
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
            <TextField
              size='small'
              fullWidth
              multiline
              value={objective}
              onChange={e => setObjective(e.target.value)}
            />
          </Box>
          <Box>
            <Typography sx={{fontWeight: 'bold'}}>Standards</Typography>
            <TextField
              size='small'
              fullWidth
              multiline
              value={standard}
              onChange={e => setStandard(e.target.value)}
            />
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
            <CKeditor
              name="description"
              onChange={(data) => {
                setBody(data);
              } }
              editorLoaded={editorLoaded} value={body}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
            <Button
              variant='contained'
              disabled={disableUpdate}
              size='small'
              onClick={updateLessonButton}
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
                        {modelContent === 'CREATE' &&
                          <>
                            <TextField
                              size='small'
                              fullWidth
                              multiline
                              value={''}
                              onChange={e => setMaterailTitle(e.target.value)}
                            />
                            <TextField
                              size='small'
                              fullWidth
                              multiline
                              value={''}
                              onChange={e => setMaterailLink(e.target.value)}
                            />
                            <Button color='error'>
                              Add New Material
                            </Button>
                          </>
                        }
                        <Typography variant="h6" component="h2">
                          Go back to screen.
                        </Typography>
                        <Button startIcon={<DeleteOutline />} onClick={() => handleClose()}>
                          Cancle
                        </Button>
                      </Box>
                    </Modal>
                  </>
                ))
              }
            </List>
          :
          // <CircularProgress color="inherit" />
          <Skeleton />
        }
      </Surface>
    </Box>
  )
}