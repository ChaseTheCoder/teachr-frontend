import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { IPost } from '../../types/types';
import CommentIcon from '@mui/icons-material/Comment';
import StarBorderIcon from '@mui/icons-material/StarBorder';

type Props = {
  post: IPost
  key: string
}

export default function Post({ post, key }: Props) {

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
      key={key}
      gap={1}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          alt="Profile Image"
          sx={{ width: { xs: 20, md: 25 }, height: { xs: 20, md: 25 }, marginRight: '1rem' }}
        />
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>User Name, </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary'> 4th Grade Teacher</Typography>
      </Box>
      <Typography variant='h2' sx={{ fontSize: { xs: 16, sm: 18 } }} fontWeight='bold'>{post.title}</Typography>
      {post.body && <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>{post.body}</Typography>}
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