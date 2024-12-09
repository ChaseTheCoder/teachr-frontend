import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import React from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IPost } from '../../../../types/types';
import { getData } from '../../../../services/authenticatedApiCalls';
import { useQuery } from '@tanstack/react-query';

type Props = {
  postId: String
}

export default function UserPost({ postId }: Props) {
  const { data: post, isFetching, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/`),
    staleTime: 1000 * 60 * 60,
  })

  if (isLoading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rectangular' height={80} />
    </Box>
  )


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
      key={post.id}
      gap={1}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          alt="Profile Image"
          sx={{ width: { xs: 30, md: 35 }, height: { xs: 30, md: 35 }, marginRight: '1rem' }}
        />
        <Typography sx={{ fontSize: { xs: 16, sm: 18 } }}>User Name, </Typography>
        <Typography sx={{ fontSize: { xs: 16, sm: 18 } }} color='textSecondary'> 4th Grade Teacher</Typography>
      </Box>
      <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold'>{post.title}</Typography>
      {post.body && <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>{post.body}</Typography>}
      <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={3}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={1}>
          <StarBorderIcon fontSize='small' color='disabled'/>
          <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary'>Like</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={1}>
          <CommentIcon fontSize='small' color='disabled'/>
          <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary'>Comment</Typography>
        </Box>
      </Box>
    </Box>
  )
}