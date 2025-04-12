'use client'

import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import VerifyEmail from '../../../components/verifyEmail';
import { useUserContext } from '../../../context/UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData } from '../../../services/authenticatedApiCalls';
import { IProfile } from '../../../types/types';
import { getDataNoToken } from '../../../services/unauthenticatedApiCalls';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PopularProps {
  onGradesChange: (grades: string[]) => void;
  onTagsChange: (tags: string[]) => void;
}

const Popular: React.FC<PopularProps> = ({ onGradesChange, onTagsChange }) => {
  const { user, auth0Id, isLoadingUser, profileData, isLoadingProfile } = useUserContext();
  const queryClient = useQueryClient();
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    onGradesChange(selectedGrades);
  }, [selectedGrades, onGradesChange]);

  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  const { data: gradesData, isFetching: isFetchingGradesData, isLoading: isLoadingGradesData, isError: isErrorGradesData } = useQuery({
    queryKey: ['grades'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/grades/`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const { data: tagsData, isFetching: isFetchingTagsData, isLoading: isLoadingTagsData, isError: isErrorTagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tags/`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const GradesAndTags: React.FC = () => {
    return (
      <Box sx={{ padding: { xs: 0, md: 2 }, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography sx={{ marginBottom: 1, fontWeight: 'bold' }} >
        Grades
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: .75, flexWrap: 'wrap' }}>
        {gradesData && gradesData.map((grade) => {
          const isSelected = selectedGrades.includes(grade.id);
          return (
            <Chip
              key={grade.id}
              label={grade.grade}
              size='small'
              variant={isSelected ? 'filled' : 'outlined'}
              color='success'
              onClick={() => {
                setSelectedGrades(prev => 
                prev.includes(grade.id) 
                  ? prev.filter(id => id !== grade.id)
                  : [...prev, grade.id]
                );
              }}
            />
        )})}
      </Box>
      <Typography sx={{ marginBottom: 1, fontWeight: 'bold', marginTop: 2 }} >
        Tags
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: .75, flexWrap: 'wrap' }}>
        {tagsData && tagsData.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <Chip
              key={tag.id}
              label={tag.tag}
              size='small'
              variant={isSelected ? 'filled' : 'outlined'}
              color='success'
              onClick={() => {
                setSelectedTags(prev => 
                prev.includes(tag.id) 
                  ? prev.filter(id => id !== tag.id)
                  : [...prev, tag.id]
                );
              }}
            />
        )})}
      </Box>
    </Box>
    )
  }

  if(isLoadingUser || isLoadingProfile || isLoadingGradesData || isLoadingTagsData) {
    return (
      <Skeleton variant='rounded' height={300} />
    )
  }

  return (
    <>
      {user && profileData && profileData.verified === false && (
        isMobile ? (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="verify-yourself-as-a-teacher-content"
              id="verify-email-header"
            >
              <Typography>Verify Yourself as a Teacher</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <VerifyEmail profileId={profileData.id} />
            </AccordionDetails>
          </Accordion>
        ) : (
          <VerifyEmail profileId={profileData.id} />
        )
      )}
      {
        isMobile ? (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='filter-posts'
              id='filter-posts-header'
            >
              <Typography>Filter Posts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GradesAndTags />
            </AccordionDetails>
          </Accordion>
        ) : (
          <GradesAndTags />
        )
      }
    </>
  );
};

export default Popular;