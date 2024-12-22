import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { IPost, IProfileBatch } from '../../types/types';
import CommentIcon from '@mui/icons-material/Comment';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Link from 'next/link';

type Props = {
  post: IPost
  profile: IProfileBatch
  homePage?: boolean
}

export default function Post({ post, profile, homePage }: Props) {

  return (
    <Link key={post.id} href={homePage ? '' : `/post/${post.id}`} passHref>
      <Box
        sx={{ 
          paddingX: 2,
          paddingY: 1.5,
          marginBottom: 1.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
        gap={1}
      >
        <Link key={post.id} href={homePage ? '' : `/profile/${profile.id}`} passHref>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center',
              borderRadius: '50px',
              paddingRight: 1,
              '&:hover': {
              cursor: 'pointer',
              bgcolor: '#f0f0f0',
              borderRadius: '50px',
              }
            }}
          >
            <Avatar
              alt="Profile Image"
              sx={{ width: { xs: 20, md: 25 }, height: { xs: 20, md: 25 }, marginRight: '.5rem' }}
            />
            <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>{profile.teacher_name ?? 'User not found'}</Typography>
            <Typography sx={{ fontSize: { xs: 12, sm: 14 }, paddingLeft: 1 }} color='textSecondary'>{profile.title ?? ''}</Typography>
          </Box>
        </Link>
        <Typography variant='h2' sx={{ fontSize: { xs: 16, sm: 18 } }} fontWeight='bold'>{post.title}</Typography>
        {post.body && <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>{post.body}</Typography>}
      </Box>
    </Link>
  )
}