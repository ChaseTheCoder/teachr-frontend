'use client'

import React, { useEffect, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Post from '../../../components/post/post';
import { getData, getDataWithParams } from '../../../services/authenticatedApiCalls';

export default function Feed() {
  const [userIds, setUserIds] = useState<string[]>([]);

  const { data: feedPosts, isFetching, isLoading, isError } = useQuery({
    queryKey: ['postsFeed'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/feed/`),
    staleTime: 1000 * 60 * 60,
  })
  
  const { data: batchProfiles, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesFeed'],
    queryFn: () => userIds.length > 0 ? getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: userIds.length > 0,
  });
  
  useEffect(() => {
    if (feedPosts) {
      const ids: string[] = [];
      feedPosts.forEach(post => {
        if (!ids.includes(post.user)) {
          ids.push(post.user);
        }
      });
      setUserIds(ids);
    }
  }, [feedPosts]);

  const posts = feedPosts?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
      {isLoading || isFetching || !posts || isLoadingBatchProfiles || !batchProfiles ? 
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
        </Box> :
        posts.map((post) => {
          const userProfile = batchProfiles?.find(profile => profile.id === post.user);
          return (
          <Post
            key={post.id}
            post={post}
            profile={userProfile}
          />
        )})
      }
    </Box>
  );
}