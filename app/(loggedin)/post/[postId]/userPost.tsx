'use client'

import { Box, Fade, IconButton, List, ListItemButton, Paper, Popper, PopperPlacementType, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { deleteData, getData } from '../../../../services/authenticatedApiCalls';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { DeleteOutline } from '@mui/icons-material';
import Link from 'next/link';
import Post404 from './not-found';
import { timeAgo } from '../../../../utils/time';
import { getDataNoToken } from '../../../../services/unauthenticatedApiCalls';
import TeacherAvatar from '../../../../components/post/avatar';
import VoteButtons from '../../../../components/post/voteButtons';
import { useUserContext } from '../../../../context/UserContext';
import { IProfile } from '../../../../types/types';
import CommentCount from '../../../../components/post/comment';
import Tags from '../../../../components/tag';

type Props = {
  postId: String
  currentUserId: String | undefined;
}

export default function UserPost({ postId, currentUserId }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const queryClient = new QueryClient();
  const [profileParam, setProfileParam] = useState<string>(null);

  const { data: profileData, isFetching: isFetchingProfileData, isLoading: isLoadingProfileData, isError: isErrorProfileData } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!auth0Id,
    initialData: () => {
      return queryClient.getQueryData(['profile']);
    },
  });

  useEffect(() => {
    if(!isLoadingProfileData && !isFetchingProfileData && !isLoadingUser) {
      if(profileData && profileData.id) {
        setProfileParam(`?user_id=${profileData.id}`);
      } else {
        setProfileParam('');
      }
    }
  }, [profileData, isFetchingProfileData, isLoadingProfileData, isLoadingUser]);

  const handleClickPopper =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };
  
  const { data: post, isFetching, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/${profileParam}`),
    staleTime: 1000 * 60 * 60,
    enabled: profileParam !== null,
  })
  
  const { data: profile, isFetching: isFetchingProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useQuery({
    queryKey: ['posterProfile', post?.user],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile/${post.user}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!post,
  })

  const mutationDelete = useMutation({
    mutationFn: () => {
      return deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${post.id}/?user_id=${profileData.id}`);
    },
    onSuccess: () => {
      window.location.href = '/feed';
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Error deleting post:', error);
    },
    onSettled: () => {
    }
  });

  const handleDeletePost = () => {
    mutationDelete.mutate();
  };

  if (isLoading || isLoadingProfile || !profile) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rectangular' height={80} />
    </Box>
  )

  if (isError || !post) return <Post404 />;

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Link href={`/profile/${profile.id}`} passHref>
          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 2,
              '&:hover': {
                cursor: 'pointer',
                bgcolor: '#f0f0f0',
                borderRadius: '50px',
            }}}
          >
            <TeacherAvatar
              verified={profile.verified}
              profilePicUrl={profile.profile_pic_url}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} fontWeight='bold'>{profile.teacher_name ?? 'User not found'}</Typography>
                <Typography sx={{ fontSize: { xs: 12, sm: 14 }, paddingLeft: 1 }} color='textSecondary'>{profile.title ?? ''}</Typography>
              </Box>
              <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>{timeAgo(post.timestamp)}</Typography>
            </Box>
          </Box>
        </Link>
        {(currentUserId !== undefined && currentUserId === post.user) &&
          <IconButton onClick={handleClickPopper('bottom-start')}>
            <MoreVert fontSize='small' />
          </IconButton>
        }
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
        gap={1}
      >
        <Typography variant='h2' component='h1' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold'>{post.title}</Typography>
        {post.body && (() => {
          const postBody = post.body.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
          return (
            <Box
              sx={{ 
                fontSize: { xs: 14, sm: 16 },
                color: '#424242',
                '& a': {
                  color: 'blue',
                  textDecoration: 'underline',
                }
              }}
              dangerouslySetInnerHTML={{ __html: postBody }}
              component="div"
            />
          );
        })()}
        <Tags
          group={post.group ?? null}
          tags={post.tags}
          grades={post.grades}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <VoteButtons
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            has_upvoted={post.has_upvoted}
            has_downvoted={post.has_downvoted}
            postId={post.id}
            type='post'
          />
          <CommentCount comments={post.comments} />
        </Box>
      </Box>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <List>
                <ListItemButton
                  sx={{ padding: 1, gap: 3 }}
                  onClick={() => handleDeletePost()}
                >
                  <DeleteOutline fontSize='small'/>   <Typography fontSize='small'>Delete Post</Typography>
                </ListItemButton>
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}