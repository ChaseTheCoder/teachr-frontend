'use client'

import React from 'react';
import { Typography, Box, Container, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDataNoToken } from '../../../services/unauthenticatedApiCalls';
import { format } from 'date-fns';

interface PolicyData {
  type: string;
  content: string;
  last_updated: string;
  created_at: string;
  url_path_name: string;
}

export default function Policy({ params }: { params: { policyUrlPath: string }}) {
  const { data: policyData, isLoading } = useQuery<PolicyData>({
    queryKey: ['policy', params.policyUrlPath],
    queryFn: () => getDataNoToken(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/policies/${params.policyUrlPath}/`
    ),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '2.5rem', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', mb: 4 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box component="article">
        <Typography 
          variant="h1" 
          component="h1"
          sx={{ 
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            mb: 2 
          }}
        >
          {policyData?.type}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Last updated: {policyData?.last_updated && 
            format(new Date(policyData.last_updated), 'MMMM d, yyyy')}
        </Typography>

        <Box 
          sx={{ 
            '& > *': { mb: 2 },
            '& h2': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              mt: 4,
              mb: 2
            },
            '& p': {
              lineHeight: 1.7,
              fontSize: '1rem'
            },
            '& ul, & ol': {
              pl: 3,
              mb: 2
            },
            '& li': {
              mb: 1
            }
          }}
        >
          {policyData?.content && (
            <div dangerouslySetInnerHTML={{ __html: policyData.content }} />
          )}
        </Box>
      </Box>
    </Container>
  );
}