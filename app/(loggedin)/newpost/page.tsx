'use client'

import React, { useState, useRef } from 'react';
import { Box, Button, ButtonGroup, Chip, Grid, Skeleton, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { postOrPatchData } from '../../../services/authenticatedApiCalls';
import Surface from "../../../components/surface/Surface";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { IGrade, IProfile } from '../../../types/types';
import { getDataNoToken } from '../../../services/unauthenticatedApiCalls';
import Editor from '../../../components/editor';

export default function NewPost() {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const router = useRouter();
  const tagInputRef = useRef<HTMLInputElement>(null);

  const queryClient = new QueryClient();
  
  const { data: profileData, isLoading: isLoadingProfile, isError } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!auth0Id,
    initialData: () => {
      return queryClient.getQueryData(['profile']);
    },
  });
  
  const { data: gradesData, isLoading: isLoadingGrades, isError: isErrorGrades } = useQuery<IGrade[]>({
    queryKey: ['grades'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/grades/`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const handleTag = async (event: React.FormEvent) => {
    if (tag.trim() === '') return;
    if (tags.some(existingTag => existingTag.tag === tag.toLocaleLowerCase())) {
      setTag('');
      return;
    }
    const tagSubmit = {
      tag: tag.toLocaleLowerCase()
    };
    try {
      const newTag = await postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tag/get/`, 'POST', tagSubmit);
      setTags([...tags, newTag]);
    } catch (error) {
      console.error('Error adding new tag:', error);
    } finally {
      setTag('');
    }
  };

  const handleDeletechip = (tagId) => {
    setTags((tags) => tags.filter((tag) => tag.id !== tagId));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const tagIds = tags.map(tag => {
      return tag.id;
    });
    const newPost = {
      title: title,
      body: body,
      grades: selectedGrades,
      tags: tagIds
    };
    try {
      await postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/user/${profileData.id}/`, 'POST', newPost);
      router.push('/feed');
    } catch (error) {
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUser || isLoadingProfile) return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          <Skeleton variant='rectangular' height={80} />
        </Box>
      </Grid>
    </Grid>
  )

  if(!auth0Id && !profileData) return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <Surface>
          <Typography variant='h4' component='h1' gutterBottom>
            Create a Public Post
          </Typography>
          <Typography variant='body1' component='p' gutterBottom paddingBottom={3}>
            You need to create an account in order to post.
          </Typography>
          <Button
            color='success'
            href={'/api/auth/signup'}
            variant='contained'
            size='large'
            sx={{ marginBottom: 2 }}
          >
            Signup, it&apos;s Free!
          </Button>
        </Surface>
      </Grid>
    </Grid>
  );
  if(auth0Id && !profileData) return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <Surface>
          <Typography variant='h4' component='h1' gutterBottom>
            Create a Public Post
          </Typography>
          <Typography variant='body1' component='p' gutterBottom>
            You&apos;re logged in, but we can&apos;t seem to find your profile.
          </Typography>
          <Button
            color='success'
            href={'/signup'}
            variant='contained'
            size='large'
          >
            Create Your Profile
          </Button>
          <Typography variant='body1' component='p' gutterBottom>
            Already signed up? Add profile <a href='/profile'>here</a>.
          </Typography>
        </Surface>
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <Surface>
          <Typography variant='h4' component='h1' gutterBottom>
          Create a Public Post
          </Typography>
          <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
            color='success'
            variant='outlined'
            size='small'
            label='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            />
          </Box>
          <Editor
            onChange={(data) => {
              setBody(data);
            }}
            value={body}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} mb={2} mt={2}>
            <ButtonGroup size="small" aria-label="Small button group">
              {gradesData && gradesData.map(grade => {
                const isSelected = selectedGrades.includes(grade.id);
                return (
                  <Button
                    key={grade.id}
                    variant={isSelected ? 'contained' : 'outlined'}
                    color='success'
                    size='small'
                    onClick={() => {
                      setSelectedGrades(prev => 
                        prev.includes(grade.id) 
                          ? prev.filter(id => id !== grade.id)
                          : [...prev, grade.id]
                      );
                    }}
                  >
                    {grade.grade}
                  </Button>
                );
              })}
            </ButtonGroup>
          </Box>
            <Box mb={1}>
              <TextField
                inputRef={tagInputRef}
                color='success'
                variant='outlined'
                size='small'
                label='Tags'
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    await handleTag(e);
                  }
                }}
                fullWidth
              />
            </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }} mb={2}>
            {tags.length > 0 ?
              tags.map(tag => {
                  return <Chip label={tag.tag} key={tag.id} size='small' onDelete={() => handleDeletechip(tag.id)} />
                }) :
              <Typography fontSize={14} color='textSecondary' ml={1}>
                Type out a tag and hit &apos;Enter&apos; so others can find your post.
              </Typography>
            }
          </Box>
          <LoadingButton
            type='submit'
            variant='contained'
            color='success'
            disabled={title === '' || isLoadingProfile || !profileData}
            loading={isLoading}
            sx={{ marginTop: 2 }}
          >
            Post
          </LoadingButton>
          </form>
        </Surface>
      </Grid>
    </Grid>
  );
}