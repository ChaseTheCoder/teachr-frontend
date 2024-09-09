'use client'

import React, { useEffect, useState } from 'react';
import Surface from '../../../components/surface/Surface';
import { TextField, Button, Box } from '@mui/material';
import { getDataNoUserId, postOrPatchData } from '../../../services/authenticatedApiCalls';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery } from '@tanstack/react-query';

export default function RegisterPage() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    if(user){
      setFirstName(user.given_name as string)
      setLastName(user.family_name as string)
    }
  }, [user]);

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleTeacherNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherName(event.target.value);
  };

  const handleJobTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(event.target.value);
  };

  const handleSubmit = () => {
    try {
      postOrPatchData('https://teachr-backend.onrender.com/userprofile/profile/', 'POST', {
        auth0_user_id: user.sub,
        first_name: firstName,
        last_name: lastName,
        teacher_name: teacherName,
        title: jobTitle
      })
      console.log('Form submitted');
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = '/dashboard';
    }
  };

  return (
    <Surface>
      <Box sx={{ gap: '3rem'}}>
        <h1>Register Page</h1>
        <TextField
          label="First Name"
          size='small'
          fullWidth
          value={firstName}
          onChange={handleFirstNameChange}
        />
        <TextField
          label="Last Name"
          size='small'
          fullWidth
          value={lastName}
          onChange={handleLastNameChange}
        />
        <TextField
          label="Teacher Name"
          size='small'
          fullWidth
          value={teacherName}
          onChange={handleTeacherNameChange}
        />
        <TextField
          label="Job Title"
          size='small'
          fullWidth
          value={jobTitle}
          onChange={handleJobTitleChange}
        />
        <Button 
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Surface>
  );
};

