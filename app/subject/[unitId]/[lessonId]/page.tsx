'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Surface from '../../../../components/surface/Surface';
import Textarea from '../../../../components/Textarea';
import CKeditor from '../../../../components/CKeditor';
import { lessonAi } from './lessonAi';
import { CircularProgress, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';

export default function Unit({
  params,
}: {
  params: { lessonId: string, unitId: string };
}) {
  const url = `http://localhost:8000/lessonplan/${params.lessonId}/`;
  let update = {}
  const [lesson, setLesson] = useState<any>('');
  const [title, setTitle] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [standard, setStandard] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [editorLoaded, setEditorLoaded] = useState(false);

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
          <Typography sx={{fontWeight: 'bold', paddingTop: 3}}>Objective</Typography>
          <button
            type="button"
            className='font-semibold text-ai underline decoration-ai'
            onClick={() => updateObjectiveAi(objective)}
          >
            AI Rewrite
          </button>
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
          <Typography sx={{fontWeight: 'bold'}}>Materials</Typography>
          { lesson ?
            (lesson.materials && lesson.materials.length > 0) &&
              <List>
                {
                  lesson.materials.map((material) => (
                      <ListItem key={material.id} disablePadding>
                        <ListItemButton href={material.link} target="_blank">
                          <ListItemText primary={material.title}/>
                        </ListItemButton>
                      </ListItem>
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