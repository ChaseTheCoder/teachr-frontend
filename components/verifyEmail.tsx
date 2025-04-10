import React, { useEffect, useState } from 'react';
import { Alert, Box, TextField, Typography } from '@mui/material';
import Surface from './surface/Surface';
import { LoadingButton } from '@mui/lab';
import { handleVerify } from '../services/authenticatedApiCalls';
import { useMutation } from '@tanstack/react-query';
import EmailIcon from '@mui/icons-material/Email';
import CopyEmail from './copyEmail';
import TeacherAvatar from './post/avatar';

const VerifyEmail: React.FC<{ profileId: string }> = ({ profileId }) => {
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [enabledVerify, setEnabledVerify] = useState(false);
  const [verificationStatus, setVerificationStatusData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      setEnabledVerify(true);
    } else {
      setEnabledVerify(false);
    }
  }, [email]);

  const mutation = useMutation({
    mutationFn: () => handleVerify(email, profileId),
    onSuccess: (data) => {
      setVerificationStatusData(data.status)
    },
    onError: (error) => {
      console.log(error);
      setError(error);
    },
  });

  const handleClickVerify = () => {
    mutation.mutate();
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setEmailVerified(true);
    }
  }, [mutation.isSuccess]);

  return (
    <Surface>
      <Box display='flex' flexDirection='column' gap={1} width='100%' maxWidth={400} margin='0 auto'>
        {
          verificationStatus === 'success' ? 
        <>
          <EmailIcon color='success' fontSize='large'/>
          <Typography lineHeight={1.2}>School email domain verified. Next, check your inbox (including SAPM) of the email you just submitted to complete verification.</Typography>
          <Typography fontSize={12}>*This does not change anything related to your login. Email submitted is just used for verification purposes.</Typography>
          <Typography fontSize={12}>For any errors, please reach out to the email below:</Typography>
          <CopyEmail />
        </> : (
        <>
          <TeacherAvatar verified={true} />
          <Typography fontSize={14} fontWeight='bold'>Verify Teacher Email, Get Stem & Leaf on Avatar</Typography>
          <Typography fontSize={12} lineHeight={1.2} color='#424242'>
            As we grow users, it will help us keep trolls out of the community. You know the keyboard warriors that couldn&apos;t survive a day in a classroom.
          </Typography>
          <TextField
            label='School Email'
            variant='outlined'
            color='success'
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LoadingButton
            variant='contained'
            color='success'
            loading={mutation.isPending}
            size='small'
            disabled={!enabledVerify || mutation.isPending}
            onClick={handleClickVerify}
          >
            Verify
          </LoadingButton>
        </>
          )
        }
        {verificationStatus === 'invalid' && (
          <>
            <Alert severity="error">Invalid school email domain. Email us from the email submitted if you want your school domain added as valid:</Alert>
            <CopyEmail />
          </>
        )}
        {mutation.isError || verificationStatus === 'error' && (
          <>
            <Alert severity="error">Error. May not be valid school email domain. Reach out to us at the email below for support:</Alert>
            <CopyEmail />
          </>
        )}
      </Box>
    </Surface>
  );
};

export default VerifyEmail;