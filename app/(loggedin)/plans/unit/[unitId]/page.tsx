'use client'

import React, { useEffect, useState } from 'react';
import Surface from '../../../../../components/surface/Surface';
import { Box, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { deleteData, getData, postOrPatchData } from '../../../../../services/authenticatedApiCalls';
import { LoadingButton } from '@mui/lab';
import { redirect, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface IUnitData {
  title?: string;
  overview?: string;
  standard?: string;
}


export default function Unit({
  params,
}: {
  params: { unitId: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [update, setUpdate] = useState<IUnitData>({})
  const [data, setData] = useState(null);
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [standard, setStandard] = useState('');
  const [disableUpdate, setDisableUpdate] = useState(true);
  console.log('PARAMS: ', params)
  console.log('URL: ', `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unit/${params.unitId}/`)
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unit/${params.unitId}/`;

  async function getUnit() {
    setLoading(true)
    try {
      getData(url)
      .then((response) => {
        setData(response)
        setTitle(response.title)
        setOverview(response.overview)
        setStandard(response.standard)
      })
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUnit();
  }, []);
  
  async function updateUnit() {
    setLoading(true);
    const titleChannged = title !== data.title
    try {
      const result = await postOrPatchData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unit/${params.unitId}/`,
        'PATCH',
        update
      )
      titleChannged && queryClient.invalidateQueries({ queryKey: ['plans'] });
      setData(result)
      setTitle('')
      setOverview('')
      setStandard('')  
    } catch (err) {
      console.log('ERROR: SUBJECT NOT PATCHED')
      console.log(err)
      setError(true)
    } finally {
      getUnit()
      setLoading(false)
    }
  }

  async function deleteUnit() {
    setLoading(true)
    try {
      await deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unit/${params.unitId}/`)
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
    if(overview === data.overview && update?.overview) delete update.overview;
    if(standard === data.standard && update?.standard) delete update.standard;
    if(title !== data.title) setUpdate({
      ...update,
      title: title
    });
    if(overview !== data.overview) setUpdate({
      ...update,
      overview: overview
    });
    if(standard !== data.standard) setUpdate({
      ...update,
      standard: standard
    });
    Object.keys(update).length === 0 ? setDisableUpdate(true) : setDisableUpdate(false);
  }
  }, [title, overview, standard, data]);

  console.log('UPDATE: ', update)

  console.log('DATA: ', data)
  console.log('title: ', title)
  console.log('overview: ', overview)

  return (
    <Surface>
      <Stack spacing={2}>
        <Typography
          variant='h6'
          sx={{display:'flex', justifyContent:'center', width: '100%'}}
        >Unit</Typography>
        {isLoading || data === null ?
          <Skeleton variant='text' sx={{ height: '50px' }} />
          :
          <TextField 
            fullWidth
            color='success'
            id="standard-basic"
            label="Subject"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        }
        {isLoading || data === null ?
          <Skeleton variant='text' sx={{ height: '50px' }} />
          :
          <TextField 
            fullWidth
            color='success'
            id="standard-basic"
            label="Overview"
            variant="standard"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
          />
        }
        {isLoading || data === null ?
          <Skeleton variant='text' sx={{ height: '50px' }} />
          :
          <TextField 
            fullWidth
            color='success'
            id="standard-basic"
            label="Standards"
            variant="standard"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
          />
        }
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <LoadingButton
            color='success'
            variant='contained'
            disabled={disableUpdate && !isLoading}
            size='small'
            onClick={() => updateUnit()}
            loading={isLoading}
          >
            Update
          </LoadingButton>
          <LoadingButton
            variant='outlined'
            disabled={isLoading}
            size='small'
            color='error'
            onClick={() => deleteUnit()}
          >
            Delete
          </LoadingButton>
        </Box>
      </Stack>
    </Surface>
  );
};