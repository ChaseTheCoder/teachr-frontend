import { Avatar, Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getData, getDataWithParams } from '../../../../services/authenticatedApiCalls';
import { useQuery } from '@tanstack/react-query';

type Props = {
  postId: string
}

export default function Comments({ postId }: Props) {
  const { data: comments, isFetching, isLoading, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/comments/`),
    staleTime: 1000 * 60 * 60,
  })
  
  const [userIds, setUserIds] = useState<string[]>([]);
  useEffect(() => {
    if (comments) {
      const ids: string[] = [];
      comments.forEach(comment => {
        if (!ids.includes(comment.user)) {
          ids.push(comment.user);
        }
      });
      setUserIds(ids);
    }
  }, [comments]);

  const { data: batchProfiles, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesPost', postId],
    queryFn: () => userIds.length > 0 ? getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: userIds.length > 0,
  })

  if (isLoading && isLoadingBatchProfiles) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
    </Box>
  )

  return (
    <>
      {(comments && comments.length > 0) ? comments.map((comment) => {
        const userProfile = batchProfiles?.find(profile => profile.id === comment.user);
        const teacherName = userProfile ? userProfile.teacher_name : 'Unknown Teacher';
        const title = userProfile ? userProfile.title : 'Unknown User';

        return (
        <Box
          sx={{ 
            paddingX: 2,
            paddingY: 1.5,
            marginBottom: 1.5,
            borderRadius: 4,
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: 'column'
          }}
          gap={1}
          key={comment.id}
        >
          <Stack
            divider={<Divider/>}
            spacing={3}
          >
              <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar
                    alt="Profile Image"
                    sx={{ width: { xs: 20, md: 25 }, height: { xs: 20, md: 25 }, marginRight: '.5rem' }}
                  />
                  <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>{teacherName}</Typography>
                  <Typography sx={{ fontSize: { xs: 14, sm: 16 }, paddingLeft: 1 }} color='textSecondary'>{ title}</Typography>
                </Box>
                <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold'>{comment.title}</Typography>
                {comment.body && <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>{comment.body}</Typography>}
                <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={1}>
                    <StarBorderIcon fontSize='small' color='disabled'/>
                    <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary'>Like</Typography>
                  </Box>
                </Box>
              </Box>
          </Stack>
        </Box>
      )}) :
        <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold' color='textSecondary'>No Comments Yet</Typography>
      } 
    </>
  )
}