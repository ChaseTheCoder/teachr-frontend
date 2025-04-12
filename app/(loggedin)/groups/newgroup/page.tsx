'use client'

import React, { useState } from 'react';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { postOrPatchData } from '../../../../services/authenticatedApiCalls';
import Surface from "../../../../components/surface/Surface";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LoadingButton } from '@mui/lab';
import { useUserContext } from '../../../../context/UserContext';

export default function NewGroup() {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const { profileData, isLoadingProfile } =  useUserContext();
  const auth0Id = user?.sub;
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    const newGroup = {
      title: title,
      about: about,
      is_public: isPublic,
      user: profileData?.id
    };

    try {
      const groupData = await postOrPatchData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/groups/`,
        'POST',
        newGroup
      );
      router.push(`/groups/${groupData.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = isLoadingUser || isLoadingProfile || !auth0Id || !profileData;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <Surface>
          <Typography variant='h4' component='h1' gutterBottom>
            Create a Group
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                color='success'
                variant='outlined'
                size='small'
                label='Group Title'
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= 255) {
                    setTitle(e.target.value);
                  }
                }}
                fullWidth
                required
                disabled={isFormDisabled}
              />
            </Box>
            <Box mb={2}>
              <TextField
                color='success'
                variant='outlined'
                size='small'
                label='About'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
                disabled={isFormDisabled}
              />
            </Box>
            <Box mb={2}>
              <Typography color="textSecondary" mb={1}>
                Group Type
              </Typography>
              <RadioGroup
                value={isPublic}
                onChange={(e) => setIsPublic(e.target.value === 'true')}
                name="group-visibility"
                defaultValue={true}
              >
                <FormControlLabel
                  value={true}
                  control={
                    <Radio
                      color='success'
                      disabled={isFormDisabled}
                    />
                  }
                  label="Public - Anyone can find and join this group"
                />
                <FormControlLabel
                  value={false}
                  control={
                    <Radio
                      color='success'
                      disabled={isFormDisabled}
                    />
                  }
                  label="Private - Members must request to join"
                />
              </RadioGroup>
            </Box>
            <LoadingButton
              type='submit'
              variant='contained'
              color='success'
              disabled={!title || !about || isFormDisabled}
              loading={isLoading}
            >
              Create Group
            </LoadingButton>
            {isFormDisabled && (
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Loading user data...
              </Typography>
            )}
          </form>
        </Surface>
      </Grid>
    </Grid>
  );
}