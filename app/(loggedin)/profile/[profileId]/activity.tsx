import React from 'react';
import Surface from '../../../../components/surface/Surface';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Box, Skeleton, Typography } from '@mui/material';
import Post from '../../../../components/post/post';
import { useQuery } from '@tanstack/react-query';
import { getDataNoToken } from '../../../../services/unauthenticatedApiCalls';
import { ActivityLoading } from '../../../../components/activityLoading';

type ActivityProps = {
  profileData: any;
  profileId: string;
};

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


export const Activity: React.FC<ActivityProps> = ({ profileId, profileData }: { profileId: string, profileData: any }) => {

  const { data: posts, isFetching, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/user/${profileId}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileId,
  })

  if (isLoading || isFetching) return (
    <ActivityLoading />
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