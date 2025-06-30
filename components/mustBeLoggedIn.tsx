'use client'

import { Box, Typography, Button } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import Link from 'next/link';

export default function MustBeLoggedIn() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        padding: 2
      }}
    >
      <LockOutlined 
        sx={{ 
          fontSize: 64,
          color: 'success.main',
          mb: 2
        }} 
      />
      <Typography 
        variant="h1" 
        component="h1"
        sx={{ 
          fontSize: { xs: '1.5rem', sm: '2rem' },
          fontWeight: 'bold',
          mb: 2
        }}
      >
        Login Required
      </Typography>
      <Typography 
        variant="body1"
        sx={{ 
          mb: 4,
          maxWidth: 'sm'
        }}
      >
        You need to be logged in to access this page. Please login or create an account to continue.
      </Typography>
      <Link href="/api/auth/login" passHref>
        <Button
          variant="contained"
          color="success"
          size="large"
        >
          Login or Sign Up
        </Button>
      </Link>
    </Box>
  );
}