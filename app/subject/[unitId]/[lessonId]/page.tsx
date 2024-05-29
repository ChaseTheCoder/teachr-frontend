'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Surface from '../../../../components/surface/Surface';
import Textarea from '../../../../components/Textarea';
import CKeditor from '../../../../components/CKeditor';
import { lessonAi } from './lessonAi';
import { Box, Button, CircularProgress, Fade, Icon, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, TextField, Typography } from '@mui/material';
import { AutoAwesome, ControlPoint, DeleteOutline, MoreVert, Update } from '@mui/icons-material';
import MaterialModal from './materialModal';

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
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);

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
    if(title !== '') update['title'] = title;
    if(objective !== '') update['objective'] = objective;
    if(standard !== '') update['standard'] = standard;
    if(body !== '') update['body'] = body;
  }, [title, objective, standard, body]);

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
    .then((response) => response.json())
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
    console.log(promptResponse)
    setObjective(promptResponse);
  }

  async function deleteLesson(id: string) {
    window.alert('deleted');
  }
  console.log(lesson.materials)
  return (
    <div className='pt-16 space-y-3'>
      <Surface>
        <div className='flex justify-between'>
          <div className='flex flex-row gap-6'>
            <button type="button" className='text-delete-light hover:text-delete' onClick={() => deleteLesson(params.lessonId)}>Delete</button>
            <button type="button" className='text-update-light hover:text-update' onClick={updateLessonButton}>Update</button>
          </div>
        </div>
        <TextField
          variant='standard'
          multiline
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          inputProps={{style: {fontWeight: 'bold', fontSize: 24}}} // font size of input text
          InputLabelProps={{style: {fontWeight: 'bold'}}} // font size of input label
        />
        <div className='flex flex-row'>
          <Typography sx={{fontWeight: 'bold'}}>Objective</Typography>
          <Button 
            aria-label='delete'
            size='small'
            color='secondary'
            onClick={() => updateObjectiveAi(objective)}
          >
            AI Rewrite { /*<AutoAwesome /> */}
          </Button>
        </div>
        <TextField
          variant='standard'
          fullWidth
          multiline
          value={objective}
          onChange={e => setObjective(e.target.value)}
        />
        <Typography sx={{fontWeight: 'bold', paddingTop: 3}}>Standards</Typography>
        <TextField
          variant='standard'
          fullWidth
          multiline
          value={standard}
          onChange={e => setStandard(e.target.value)}
        />
        <Typography sx={{fontWeight: 'bold', paddingTop: 3}}>Lesson Outline</Typography>
        <CKeditor
          name="description"
          onChange={(data) => {
            setBody(data);
          } }
          editorLoaded={editorLoaded} value={body}
        />
        </Surface>

        <Surface>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant='h2' sx={{fontWeight: 'bold', fontSize: '24px'}}>Materials</Typography>
            <IconButton size='small'>
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
                    <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => handleOpen()}>
                      <DeleteOutline/>   <Typography>Delete</Typography>
                    </ListItemButton>
                    <ListItemButton sx={{ padding: 1, gap: 3 }} onClick={() => handleOpen()}>
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
                      {/* <MaterialModal
                        title={material.title}
                        link={material.link}
                        id={material.id}
                      /> */}
                      <Modal
                        open={openModal}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <Typography variant="h6" component="h2">
                            Delete forever?
                          </Typography>
                          <Button color='error' startIcon={<DeleteOutline />} onClick={() => deleteMaterial(material.id)}>
                            Delete
                          </Button>
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
            <CircularProgress color="inherit" />
          }
        </Surface>
    </div>
  )
}