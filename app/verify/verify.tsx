import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/loading';
import { useSearchParams } from 'next/navigation';

interface VerifyProps {
  email: string;
  user_id: string;
}

const Verify: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const user_id = searchParams.get('user_id');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/verify/${user_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ verified_email: email }),
        });

        if (!response.ok) {
          setError(true);
          throw new Error('Failed to verify email');
        }

        const data = await response.json();
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [email, user_id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100%', marginTop: 2, padding: 4, borderRadius: 2 }}>
        <LoadingIndicator description='Verifying Your Teacher Email' />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100%', marginTop: 2 }}>
        <Typography variant='h4' component='h1' gutterBottom>Failed to verify email</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'white', padding: 2, borderRadius: 2 }}>
      <Typography variant='h4' component='h1' gutterBottom>Your Email Has Been Verified</Typography>
    </Box>
  );
};

export default Verify;