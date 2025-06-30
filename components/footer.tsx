import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer>
      <Box
        sx={{
          bgcolor: '#fff',
          padding: 3,
          borderRadius: 4,
          position: 'relative',
          marginTop: 3
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          divider={<Typography color="text.secondary">•</Typography>}
        >
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle2' color='success.main'>
              © 2025 Teacher Lounge
            </Typography>
          </Link>
          <Link href="/policies/privacy-policy" style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle2' color='success.main'>
              Privacy Policy
            </Typography>
          </Link>
          <Link href="/policies/terms-of-service" style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle2' color='success.main'>
              Terms of Service
            </Typography>
          </Link>
        </Stack>
      </Box>
    </footer>
  );
};

export default Footer;