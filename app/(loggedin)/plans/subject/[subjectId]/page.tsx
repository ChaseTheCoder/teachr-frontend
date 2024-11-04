'use client'

import React, { useEffect, useState } from 'react';
import Surface from '../../../../../components/surface/Surface';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { deleteData, getData, postOrPatchData } from '../../../../../services/authenticatedApiCalls';
import { LoadingButton } from '@mui/lab';
import { redirect, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Subject({
  params,
}: {
  params: { subjectId: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [data, setData] = useState(null);
  const [subject, setSubject] = useState('');
  const [subjectGrade, setSubjectGrade] = useState('');
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [gradeLevelsSelected, setGradeLevelsSelected] = useState<string[]>([]);
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`;

  const { data: gradeLevels, isFetching, isLoading: isLoadinGrades, isError: isErrorGrades } = useQuery({
    queryKey: ['grade_levels'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/grade_levels/`),
    staleTime: 1000 * 60 * 60 * 24 * 7 // 1 week
  });

  console.log('GRADE LEVELS: ', gradeLevels);

  async function getSubject() {
    setLoading(true);
    try {
      const response = await getData(url);
      setData(response);
      setSubject(response.subject);
      setSubjectGrade(response.grade);
      setGradeLevelsSelected(response.grade_levels);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSubject();
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const selectedIds = typeof value === 'string' ? value.split(',') : value;
    setGradeLevelsSelected(selectedIds);
    const selectedGradeLevels = gradeLevels
      ?.filter((level) => selectedIds.includes(level.id))
      .map((level) => level.grade_level)
      .join(', ');
    setSubjectGrade(selectedGradeLevels);
  };

  async function updateSubject() {
    setLoading(true);
    try {
      await postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`, 'PATCH', {
        subject: subject,
        grade_levels: gradeLevelsSelected,
      });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubject() {
    setLoading(true)
    try {
      await deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/subject/${params.subjectId}/`)
      router.push('/plans')
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    } catch (err) {
      console.log('ERROR: SUBJECT NOT DELETED')
      console.log(err)
      setError(true)
      setLoading(false);
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
      if (subject !== data.subject || gradeLevelsSelected !== data.grade_levels) {
        setDisableUpdate(false);
      } else {
        setDisableUpdate(true);
      }
    }
  }, [data, isError, isLoading, subject, subjectGrade, gradeLevelsSelected]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading subject data</Typography>;

  return (
    <Box style={{ minHeight: '90vh' }}>
      <Surface>
        <Typography variant='h1' fontSize={32} fontWeight='bold' paddingBottom={4}>
          Edit Subject
        </Typography>
        <TextField
          label='Subject'
          color='success'
          variant='standard'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          margin='normal'
        />
        <FormControl variant='standard' color='success' fullWidth margin="normal">
          <InputLabel id="grade-levels-label">Grade Levels</InputLabel>
          <Select
            labelId="grade-levels-label"
            id="grade-levels"
            label="Grade Level(s)"
            multiple
            value={gradeLevelsSelected}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={gradeLevels.find((level) => level.id === value)?.grade_level} />
                ))}
              </Box>
            )}
          >
            {gradeLevels?.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.grade_level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <LoadingButton
            color='success'
            variant='contained'
            onClick={updateSubject}
            loading={isLoading}
            disabled={disableUpdate}
          >
            Update Subject
          </LoadingButton>
          <LoadingButton
            variant='outlined'
            disabled={isLoading}
            size='small'
            color='error'
            onClick={() => deleteSubject()}
          >
            Delete
          </LoadingButton>
        </Box>
      </Surface>
    </Box>
  );
}