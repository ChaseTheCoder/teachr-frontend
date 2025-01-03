'use client'

import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import Surface from "../../../../components/surface/Surface";
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { getData, postSchedule } from "../../../../services/authenticatedApiCalls";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LoadingButton } from "@mui/lab";
import { useRouter } from 'next/navigation';
import { IProfile } from "../../../../types/types";

export default function AddCalendar() {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const [schoolYearTitle, setSchoolYearTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateFormated, setStartDateFormated] = useState<string | null>(null);
  const [endDateFormated, setEndDateFormated] = useState<string | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const router = useRouter();
  const [auth0Id, setAuth0Id] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoadingUser && !auth0Id) {
      setAuth0Id(user.sub);
    }
  }, [user, isLoadingUser, auth0Id]);

  function handleChangeStartDate(value){
    setStartDate(value)
  }
  function handleChangeEndDate(value){
    setEndDate(value)
  }

  useEffect(() => {
    if (startDate instanceof DateObject) {
      const formattedDate = startDate.toDate().toISOString().split('T')[0];
      setStartDateFormated(formattedDate);
    }
  }, [startDate]);
  useEffect(() => {
    if (endDate instanceof DateObject) {
      const formattedDate = endDate.toDate().toISOString().split('T')[0];
      setEndDateFormated(formattedDate);
    }
  }, [endDate]);

  const queryClient = new QueryClient();
  const { data: profileData, isFetching, isLoading, isError } = useQuery<IProfile>({
    queryKey: ['profile', auth0Id],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    initialData: () => {
      return queryClient.getQueryData(['profile', auth0Id]);
    },
  })
  
  function handleClickPostSchedule(){
    try {
      postSchedule({
        owner: profileData.id,
        title: schoolYearTitle,
        start_date: startDateFormated,
        end_date: endDateFormated
      })
      .then((response) => setScheduleData(response))
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingSchedule(false);
      router.push(`/schedule/add/${scheduleData.id}`);
    }
  }


  return (
    <Box style={{ minHeight: '90vh' }}>      
      <Surface>
        <Typography
          variant='h1'
          fontSize={32}
          fontWeight='bold'
          paddingBottom={4}
        >
          Add Schedule
        </Typography>
        <Box
          display='flex'
          flexDirection='column'
          gap={2}
        >
          <Box
            display='flex'
            flexDirection='column'
          >
            <Typography variant='h2' fontSize={18} fontWeight='bold'>Title of your new school year:</Typography>
            <TextField 
              fullWidth
              color='success'
              id="standard-basic"
              variant="standard"
              value={schoolYearTitle}
              onChange={(e) => setSchoolYearTitle(e.target.value)}
              sx={{ width: '50%' }}
            />
          </Box>
          <Box
            display='flex'
            flexDirection='row'
            gap={4}
          >
            <Box
              display='flex'
              flexDirection='column'
              gap={1}
            >
              <Typography variant='h3' fontSize={14}>First day of school:</Typography>
              <DatePicker
                value={startDate}
                onChange={handleChangeStartDate}
                type='calendar'
                className='green'
              />
            </Box>
            <Box
              display='flex'
              flexDirection='column'
              gap={1}
            >
              <Typography variant='h3' fontSize={14}>Last day of school:</Typography>
              <DatePicker
                value={endDate}
                onChange={handleChangeEndDate}
                type='calendar'
                className='green'
              />
            </Box>
          </Box>
          <LoadingButton
            variant='contained'
            color='success'
            sx={{ marginTop: 4 }}
            size='small'
            disabled={!schoolYearTitle || !startDateFormated || !endDateFormated || !profileData}
            onClick={handleClickPostSchedule}
            loading={loadingSchedule}
          >
            Save and Continue to Set School Calendar
          </LoadingButton>
        </Box>
      </Surface>
    </Box>
  )
}