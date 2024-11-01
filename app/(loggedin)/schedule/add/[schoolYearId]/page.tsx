'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { getData, postOrPatchData } from "../../../../../services/authenticatedApiCalls";
import Surface from "../../../../../components/surface/Surface";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { calculateMonthsDifference, convertSelectedDates, getDatesBetween } from "../../../../../utils/schedule-helpers";
import { LoadingButton } from "@mui/lab";

export default function AddCalendar({
  params,
}: {
  params: { schoolYearId: string };
}) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isPostError, setPostError] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [selected, setSelected] = useState<Date[]>([]);
  const [monthsDifference, setMonthsDifference] = useState<number | null>(null);
  
  async function getScheduleData() {
    setLoading(true)
    try {
      const response = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/schedule/${params.schoolYearId}`);
      setScheduleData(response);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getScheduleData();
  }, []);

  
  useEffect(() => {
    if (scheduleData?.start_date && scheduleData?.end_date) {
      const dates = getDatesBetween(scheduleData.start_date, scheduleData.end_date);
      setSelected(dates);
    }
    setMonthsDifference(scheduleData?.start_date && scheduleData?.end_date
      ? calculateMonthsDifference(scheduleData.start_date, scheduleData.end_date)
      : null);
  }, [scheduleData]);
    
  const defaultMonth = scheduleData?.start_date ? new Date(scheduleData.start_date) : new Date();
  const endMonth = scheduleData?.end_date ? new Date(scheduleData.end_date) : new Date();

  async function handleClickPostDates() {
    setLoading(true);
    setError(false);
    const dates = await convertSelectedDates(selected);
    console.log('dates:', dates);
    const body = {
      school_year: params.schoolYearId,
      dates: dates
    }
    try {
      const result = await postOrPatchData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/day`,
        'POST',
        body
      );
      router.push(`/schedule/add/${scheduleData.id}/add-classes`);
    } catch (error) {
      console.error('Error:', error);
      setPostError(true);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  console.log('selected:', convertSelectedDates(selected));
  if(isLoading) return <Typography>Loading...</Typography>;
  if(isError) return <Typography>Error loading schedule data</Typography>;

  return (
    <Box style={{ minHeight: '90vh' }}>      
      <Surface>
        <Typography
          variant='h1'
          fontSize={32}
          fontWeight='bold'
          paddingBottom={4}
        >
          Add Calendar Dates
        </Typography>
        <Typography variant='h2' fontSize={18} fontWeight='bold'>Your new school year has been created!</Typography>
        <Typography fontSize={14}>Title: {scheduleData?.title}</Typography>
        <Typography fontSize={14}>Start Date: {scheduleData?.start_date}</Typography>
        <Typography fontSize={14}>End Date: {scheduleData?.end_date}</Typography>
        <Typography variant='h2' fontSize={18} fontWeight='bold'>Next, select and unselect dates to create your school year schedule:</Typography>
        {/* {!isLoading || !isError && */}
          <DayPicker
            mode="multiple"
            numberOfMonths={monthsDifference}
            pagedNavigation={false}
            selected={selected}
            onSelect={setSelected}
            defaultMonth={defaultMonth}
            startMonth={defaultMonth}
            endMonth={endMonth}
          />
        {/* } */}
        <LoadingButton
          variant='contained'
          color='success'
          sx={{ marginTop: 4 }}
          size='small'
          onClick={handleClickPostDates}
          loading={isLoading}
        >
          Submit Dates for Schedule
        </LoadingButton>
      </Surface>
    </Box>
  )
}