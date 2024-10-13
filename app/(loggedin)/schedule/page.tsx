'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { getData, getDataWithParams } from '../../../services/authenticatedApiCalls';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ChevronLeft, ChevronRight, DateRange } from '@mui/icons-material';
import { getMonthRange, getWeekDates } from '../../../utils/schedule-helpers';
import Surface from '../../../components/surface/Surface';

export default function Calendar() {
  const [schoolTitle, setSchoolTitle] = React.useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState(getWeekDates(0));
  const [weekDatesParams, setWeekDatesParams] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [month, setMonth] = useState('');

  useEffect(() => {
    const newWeekDates = getWeekDates(weekOffset);
    setWeekDates(newWeekDates);

    setWeekDatesParams([
      newWeekDates.monday,
      newWeekDates.tuesday,
      newWeekDates.wednesday,
      newWeekDates.thursday,
      newWeekDates.friday,
    ]);
  }, [weekOffset]);

  useEffect(() => {
    let monthstring = getMonthRange(new Date(weekDates.monday), new Date(weekDates.friday))
    setMonth(monthstring);
  }, [weekDates]);

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const newSchoolTitle = event.target.value as string;
    setSchoolTitle(newSchoolTitle);
    localStorage.setItem('schoolTitle', newSchoolTitle); // Save schoolTitle to local storage
    const selected = schedulesData?.find((schedule: any) => schedule.title === newSchoolTitle);
    setSelectedSchedule(selected?.id);
  };

  const { user, error, isLoading: userLoading } = useUser();
  const auth0Id = user?.sub;
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })
  
  const { data: schedulesData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/schedules/${profileData.id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
  })
  
  const { data: schoolDaysData } = useQuery({
    queryKey: ['schoolDays', weekDatesParams, selectedSchedule],
    queryFn: () => getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/days_range/${selectedSchedule}/`, weekDatesParams),
    staleTime: 1000 * 60 * 60,
    enabled: !!weekDatesParams && !!selectedSchedule,
  })

  useEffect(() => {
    const savedSchoolTitle = localStorage.getItem('schoolTitle');
    if (savedSchoolTitle) {
      setSchoolTitle(savedSchoolTitle);
      const selected = schedulesData?.find((schedule: any) => schedule.title === savedSchoolTitle);
      setSelectedSchedule(selected?.id);
    }
  }, [schedulesData]);

  function RenderDay({ date }: { date: string }): JSX.Element {
    console.log('date: ' + date);
    console.log('schoolDaysData: ' + schoolDaysData);
    return (
      <Box flex={1} display='flex' flexDirection='column' key={date}>
        <Box display='flex' flexDirection='column' sx={{ paddingY: '1rem' }}>
          <Typography fontSize={24}>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}</Typography>
          <Typography>{new Date(date).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })}</Typography>
        </Box>
        {schoolDaysData?.find((day: any) => day.date === date) ? (
          <Box sx={{ padding: 1.5, borderRadius: 4, bgcolor: '#ffffff' }}>
            <Typography fontSize={14}>{schoolDaysData.find((day: any) => day.date === date).date}</Typography>
          </Box>
        ) : (
          <Box sx={{ padding: 1.5, borderRadius: 4, bgcolor: '#e0e0e0', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography fontSize={14}>No school</Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box style={{ minHeight: '90vh' }}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Box display='flex' flexDirection='row' alignItems='center' gap={1}>
          <Button
            size='small'
            startIcon={<DateRange />}
            color='success'
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
          >
            Current Week
          </Button>
          <IconButton
            aria-label="go to previous week"
            onClick={handlePreviousWeek}
          >
            <ChevronLeft fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="go to previous week"
            onClick={handleNextWeek}
          >
            <ChevronRight fontSize="inherit" />
          </IconButton>
          <Typography>{month}</Typography>
        </Box>
        <Box display='flex' flexDirection='column'>
            <Typography variant='overline'>School Year</Typography>
            <FormControl variant="standard" sx={{ minWidth: 'auto' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={schoolTitle ?? 'Select School Year'}
                onChange={(event) => {
                  handleChange(event);
                  const selected = schedulesData?.find((schedule: any) => schedule.title === event.target.value);
                  setSelectedSchedule(selected?.id);
                }}
              >
                {schedulesData?.map((schedule: any) => (
                <MenuItem value={schedule.title} key={schedule.id}>{schedule.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>
      </Box>
      <Box display="flex" flexDirection='row' width='100%' gap={1}>
        <RenderDay date={weekDates.monday}/>
        <RenderDay date={weekDates.tuesday}/>
        <RenderDay date={weekDates.wednesday}/>
        <RenderDay date={weekDates.thursday}/>
        <RenderDay date={weekDates.friday}/>
      </Box>
    </Box>
  )
}