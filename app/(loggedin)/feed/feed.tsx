'use client'

import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Post from '../../../components/post/post';
import { getData } from '../../../services/authenticatedApiCalls';

export default function Feed() {
  const { data: postsQuery, isFetching, isLoading, isError } = useQuery({
    queryKey: ['postsFeed'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/feed/`),
    staleTime: 1000 * 60 * 60,
  })

  const posts = postsQuery?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }} gap={.5}>
      {isLoading || isFetching || !posts ? 
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
        </Box> :
        posts.map((post) => (
          <Post key={post.id} post={post} />
        ))
      }
    </Box>
  );
}