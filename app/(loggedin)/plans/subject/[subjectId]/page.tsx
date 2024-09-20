'use client'

import React, { useEffect, useState } from 'react';
import Surface from '../../../../../components/surface/Surface';
import { Box, Button, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { deleteData, getData, postOrPatchData } from '../../../../../services/authenticatedApiCalls';
import { LoadingButton } from '@mui/lab';
import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Subject({
  params,
}: {
  params: { subjectId: string };
}) {
  const { user, isLoading: isLoadingUser } = useUser();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [data, setData] = useState(null);
  const [subject, setSubject] = useState('');
  const [subjectGrade, setSubjectGrade] = useState('');
  const [disableUpdate, setDisableUpdate] = useState(true);
  console.log('PARAMS: ', params)
  console.log('URL: ', `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`)
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`;

  async function getSubject() {
    setLoading(true)
    try {
      const response = await getData(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('RESPONSE: ', response)
      setData(response);
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubject();
  }, []);
  
  async function updateSubject() {
    setLoading(true)
    try {
      postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`, 'PATCH', {
          subject: subject,
          grade: subjectGrade
        }
      )
    } catch (err) {
      console.log('ERROR: SUBJECT NOT PATCHED')
      console.log(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSubject() {
    setLoading(true)
    try {
      await deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`)
      redirect('/plans')
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
      setError(true)
    }
  }

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setSubject(data.subject);
      setSubjectGrade(data.grade);
    }
  }, [isLoading, isError, data]);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (subject !== data.subject || subjectGrade !== data.grade) {
        setDisableUpdate(false);
      } else {
        setDisableUpdate(true);
      }
    }
  }, [data, isError, isLoading, subject, subjectGrade]);
  console.log('DATA: ', data)
  console.log('SUBJECT: ', subject)
  console.log('GRADE: ', subjectGrade)

  return (
    <Surface>
      <Stack spacing={2}>
        <Typography variant='h6' >Subject</Typography>
        {isLoading ?
          <Skeleton variant='text' />
          :
          <TextField 
            fullWidth
            id="standard-basic"
            label="Subject"
            variant="standard"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        }
        <TextField 
          fullWidth
          id="standard-basic"
          label="Grade"
          variant="standard"
          value={subjectGrade}
          onChange={(e) => setSubjectGrade(e.target.value)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <LoadingButton
            variant='contained'
            disabled={disableUpdate}
            size='small'
            onClick={() => updateSubject()}
            loading={isLoading}
          >
            Update
          </LoadingButton>
          <LoadingButton
            variant='contained'
            disabled={isLoading}
            size='small'
            color='error'
            onClick={() => deleteSubject()}
          >
            Delete
          </LoadingButton>
        </Box>
      </Stack>
    </Surface>
  );
};