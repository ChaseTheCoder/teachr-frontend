import React from 'react';
import Surface from '../../../components/surface/Surface';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Box, Skeleton, Typography } from '@mui/material';
import { IPost } from '../../../types/types';
import Post from '../../../components/post/post';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getData } from '../../../services/authenticatedApiCalls';

type Props = {
  posts: IPost[] | null;
}

const NoActivity: React.FC = () => {
  return (
    <Surface>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '3rem' }} gap={2} >
        <HistoryEduIcon fontSize='large' />
        <Typography color='textSecondary'>No Posts or Comments Yet</Typography>
      </Box>
    </Surface>
  )
}

const Activity: React.FC = () => {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;

  const { data: profileData, isFetching: isFetchingProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })

  const { data: posts, isFetching, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/user/${profileData.id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
  })

  if (isLoadingProfile || isLoading || isLoadingUser || isFetchingProfile || isFetching) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
        { (posts && posts.length > 0) ? 
          posts.map((post) => (
            <Post key={post.id} post={post} profile={profileData} />
          )) :
          <NoActivity />
        }
    </Box>
  );
};

export default Activity;