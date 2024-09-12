'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Fade, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Popper, PopperPlacementType, Skeleton, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { AutoAwesome, ControlPoint, DeleteOutline, MoreVert, Update } from '@mui/icons-material';
import Surface from '../../../../../components/surface/Surface';
import CKeditor from '../../../../../components/CKeditor';
import { deleteData, getData, navigate, postOrPatchData } from '../../../../../services/authenticatedApiCalls';
import { lessonAi } from './lessonAi';

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
  const urlLesson = `https://teachr-backend.onrender.com/lessonplan/${params.lessonId}/`;
  const lessonOutline = '<p><strong>Introduction</strong>:</p> \n\n<p><strong>Activity</strong>:</p>\n\n<p><strong>Guided Practice</strong>:</p> \n\n<p><strong>Independent Practice</strong>:</p> \n\n<p><strong>Closure</strong>:</p> \n\n<p><strong>Assessment</strong>:</p> \n\n<p><strong>Materials</strong>:</p>';
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
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  const [materialId, setMaterialId] = useState(null);
  const [disableMaterail, setDisableMaterail] = useState(true);
  const [modelContent, setModelContent] = useState<null | 'CREATE' | 'UPDATE' | 'DELETE'>(null);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => {
    setMaterialId(null);
    setOpenModel(false);
    setModelContent(null);
  }

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  async function getLesson() {
    setLoadingLesson(true)
    try {
      getData(urlLesson)
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

  async function patchLesson() {
    setLoadingUpdate(true);
    try {
      postOrPatchData(urlLesson, 'PATCH', update)
    } catch (err) {
      console.log('ERROR: SUBJECT NOT PATCHED')
      console.log(err)
    } finally {
      setUpdate({})
      setTimeout(() => {setLoadingUpdate(false)}, 2000)
      setDisableUpdate(true)
    }
  }

  async function deleteLesson() {
    const unitId = params.unitId;
    try {
      deleteData(urlLesson)
      navigate(`/subject/${unitId}/`)
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
    }
    
  }

  async function updateObjectiveAi(prompt: string) {
    console.log('updateObjectiveAi initiated')
    const objectivePrompt = `Write a lesson objective based on this prompt basing it in Common Core State Standards: ${prompt}`;
    const promptResponse = await lessonAi(prompt);
    setObjective(promptResponse);
  }

  async function updateLessonOutlineAi(prompt: string) {
    console.log('updateLessonOutlineAi initiated')
    const promptFinal = `Write a lesson plan within this format, ${lessonOutline} based on ${objective !== '' && 'this objective, '+objective+', and '}`  + 'this prompt: ' + prompt;
    const promptResponse = await lessonAi(promptFinal);
    setBody(promptResponse);
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
              onClick={() => deleteLesson()}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Surface>
    </Box>
  )
}