import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { IPost, IProfileBatch } from '../../types/types';
import Link from 'next/link';
import { timeAgo } from '../../utils/time';
import TeacherAvatar from './avatar';

type Props = {
  post: IPost
  profile: IProfileBatch
  homePage?: boolean
}

export default function Post({ post, profile, homePage }: Props) {

  return (
    <Box
      sx={{ 
        paddingX: 2,
        paddingY: 1.5,
        borderRadius: 4,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
      gap={1}
    >
      {profile &&
        <Link key={`feed-profile-${profile.id}`} href={homePage ? '/#' : `/profile/${profile.id}`} passHref>
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
            <TeacherAvatar verified={profile?.verified} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} fontWeight='bold'>{profile.teacher_name ?? 'User not found'}</Typography>
                <Typography sx={{ fontSize: { xs: 12, sm: 14 }, paddingLeft: 1 }} color='textSecondary'>{profile.title ?? ''}</Typography>
              </Box>
              <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>{timeAgo(post.timestamp)}</Typography>
            </Box>
          </Box>
        </Link>
      }
      <Link
        key={post.id}
        href={homePage ? '/#' : `/post/${post.id}`}
        passHref
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              cursor: 'pointer',
              bgcolor: '#f0f0f0',
              borderRadius: 1,
            },
          }}
          gap={1}
        >
          <Typography variant='h2' sx={{ fontSize: { xs: 16, sm: 18 } }} fontWeight='bold'>{post.title}</Typography>
          {post.body && (
            <Box
              sx={{ 
                fontSize: { xs: 14, sm: 16 },
                color: '#424242',
                '& a': {
                  color: 'blue',
                  textDecoration: 'underline',
                }
              }}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          )}
        </Box>
      </Link>
    </Box>
  )
}