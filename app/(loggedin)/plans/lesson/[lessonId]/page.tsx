'use client'

import React, { useEffect, useState } from 'react';
import Surface from '../../../../../components/surface/Surface';
import { Box, IconButton, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { deleteData, getData, postOrPatchData } from '../../../../../services/authenticatedApiCalls';
import { LoadingButton } from '@mui/lab';
import { redirect, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import CKeditor from '../../../../../components/CKeditor';
import { AutoAwesome } from '@mui/icons-material';
import { lessonAi } from '../../../../../services/openAI';

interface ILessonData {
  title?: string;
  objective?: string;
  standard?: string;
  body?: string;
}


export default function Lesson({
  params,
}: {
  params: { lessonId: string };
}) {
  const lessonOutline = '<p><strong>Introduction</strong>:</p> \n\n<p><strong>Activity</strong>:</p>\n\n<p><strong>Guided Practice</strong>:</p> \n\n<p><strong>Independent Practice</strong>:</p> \n\n<p><strong>Closure</strong>:</p> \n\n<p><strong>Assessment</strong>:</p> \n\n<p><strong>Materials</strong>:</p>';
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [update, setUpdate] = useState<ILessonData>({})
  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null);
  const [objective, setObjective] = useState(null);
  const [standard, setStandard] = useState(null);
  const [body, setBody] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/lesson/${params.lessonId}/`;

  async function getLesson() {
    setLoading(true)
    try {
      getData(url)
      .then((response) => {
        setData(response)
        setTitle(response.title)
        setObjective(response.objective)
        setStandard(response.standard)
        setBody(response.body)
      })
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLesson();
  }, []);
  
  async function updateLesson() {
    setLoading(true);
    const titleChannged = title !== data.title
    try {
      const result = await postOrPatchData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/lesson/${params.lessonId}/`,
        'PATCH',
        update
      )
      titleChannged && queryClient.invalidateQueries({ queryKey: ['plans'] });
    } catch (err) {
      console.log('ERROR: SUBJECT NOT PATCHED')
      console.log(err)
      setError(true)
    } finally {
      getLesson()
      setLoading(false)
    }
  }

  async function deleteLesson() {
    setLoading(true)
    try {
      await deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/lesson/${params.lessonId}/`)
      router.push('/plans')
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
      setError(true)
    }
  }

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setData(data);
    }
  }, [isLoading, isError, data]);

  useEffect(() => {
  if(data !== null) {
    if(title === data.title && update?.title) delete update.title;
    if(objective === data.objective && update?.objective) delete update.objective;
    if(standard === data.standard && update?.standard) delete update.standard;
    if(body === data.body && update?.body) delete update.body;
    if(title !== data.title) setUpdate({
      ...update,
      title: title
    });
    if(objective !== data.objective) setUpdate({
      ...update,
      objective: objective
    });
    if(standard !== data.standard) setUpdate({
      ...update,
      standard: standard
    });
    if(body !== data.body) setUpdate({
      ...update,
      body: body
    });
    console.log('UPDATE: ', update)
    Object.keys(update).length === 0 ? setDisableUpdate(true) : setDisableUpdate(false);
  }
  }, [title, objective, standard, body, data]);

  async function updateObjectiveAi(prompt: string) {
    const objectivePrompt = `Write a single sentence lesson objective based on this prompt basing it in Common Core State Standards: ${prompt}`;
    const promptResponse = await lessonAi(objectivePrompt);
    setObjective(promptResponse);
  }

  async function updateLessonOutlineAi(prompt: string) {
    const promptFinal = `Write a lesson plan within this format, ${lessonOutline} based on ${objective !== '' && 'this objective, '+objective+', and '}`  + 'this prompt: ' + prompt;
    const promptResponse = await lessonAi(promptFinal);
    setBody(promptResponse);
  }

  return (
    <Surface>
      <Stack spacing={3}>
        <Typography
          variant='h6'
          sx={{display:'flex', justifyContent:'center', width: '100%'}}
        >Lesson</Typography>
        {title === null ?
          <Skeleton variant='text' sx={{ height: '50px' }} />
          :
          <TextField 
            fullWidth
            multiline
            color='success'
            id="standard-basic"
            label="Title"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
          {objective === null ?
            <Skeleton variant='text' sx={{ height: '50px' }} />
            :
            <TextField 
              fullWidth
              multiline
              color='success'
              id="standard-basic"
              variant="standard"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          }
        </Box>
        {standard === null ?
          <Skeleton variant='text' sx={{ height: '50px' }} />
          :
          <TextField 
            fullWidth
            multiline
            color='success'
            id="standard-basic"
            label="Standards"
            variant="standard"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
          />
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
          <Box>
            {body === null ?
              <Skeleton variant='text' sx={{ height: '50px' }} />
              :
              <CKeditor
                onChange={(data) => {
                  setBody(data);
                } }
                value={body}
              />
            }
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <LoadingButton
            color='success'
            variant='contained'
            disabled={disableUpdate && !isLoading}
            size='small'
            onClick={() => updateLesson()}
            loading={isLoading}
          >
            Update
          </LoadingButton>
          <LoadingButton
            variant='outlined'
            disabled={isLoading}
            size='small'
            color='error'
            onClick={() => deleteLesson()}
          >
            Delete
          </LoadingButton>
        </Box>
      </Stack>
    </Surface>
  );
};