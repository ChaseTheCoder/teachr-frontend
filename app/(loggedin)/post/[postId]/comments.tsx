import { Avatar, Box, Divider, Fade, IconButton, List, ListItemButton, Paper, Popper, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { deleteData } from '../../../../services/authenticatedApiCalls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteOutline, MoreVert } from '@mui/icons-material';
import Link from 'next/link';
import { timeAgo } from '../../../../utils/time';
import { getDataNoToken, getDataWithParamsNoToken } from '../../../../services/unauthenticatedApiCalls';
import PostComment from './postComment';
import TeacherAvatar from '../../../../components/post/avatar';
import VoteButtons from '../../../../components/post/voteButtons';

type Props = {
  postId: string
  currentUserId: String | undefined;
}

export default function Comments({ postId, currentUserId }: Props) {
  const popperRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [profileParam, setProfileParam] = useState<string>(null);

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
    setOpen(open ? false : true);
    setAnchorEl(event.currentTarget as HTMLButtonElement);
    setSelectedCommentId(commentId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popperRef]);

  useEffect(() => {
    if(currentUserId) {
      setProfileParam(`/?user_id=${currentUserId}`);
    } else {
      setProfileParam('/');
    }
  }, [currentUserId]);
    
  const { data: comments, isFetching: isFetchingComments, isLoading: isLoadingComments, isError } = useQuery({
    queryKey: ['comments', postId, profileParam],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/comments${profileParam}`),
    staleTime: 1000 * 60 * 60,
    enabled: profileParam !== null,
  })

  const mutationDelete = useMutation({
    mutationFn: () => {
      return deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/comment/${selectedCommentId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
    onSettled: () => {
    }
  });

  const handleDeleteComment = () => {
    mutationDelete.mutate();
  };

  if (isLoadingComments || isFetchingComments) return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
    </Box>
  )

  return (
    <>
      <PostComment postId={postId} />
      {(comments && comments.length > 0) ? comments.map((comment) => {
        return (
        <Box
          id={`comment-${comment.id}`}
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href={`/profile/${comment.user.id}`} passHref>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 1,
                  '&:hover': {
                    cursor: 'pointer',
                    bgcolor: '#f0f0f0',
                    borderRadius: '50px',
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <TeacherAvatar verified={comment.user.verified} profilePicUrl={comment.user.profile_pic_url} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} fontWeight='bold'>{comment.user.teacher_name ?? 'User not found'}</Typography>
                      <Typography sx={{ fontSize: { xs: 12, sm: 14 }, paddingLeft: 1 }} color='textSecondary'>{comment.user.title ?? ''}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>{timeAgo(comment.timestamp)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Link>
            {(currentUserId !== undefined && currentUserId === comment.user) &&
              <IconButton onClick={(event) => handleClickPopper(event, comment.id)}>
                <MoreVert fontSize='small' />
              </IconButton>
            }
          </Box>
          {comment.body &&
            <Box
              sx={{ 
                fontSize: { xs: 14, sm: 16 },
                color: '#424242',
                '& a': {
                  color: 'blue',
                  textDecoration: 'underline',
                },
                margin: 0
              }}
              dangerouslySetInnerHTML={{ __html: comment.body }}
              component="p"
              role='comment'
            />}
        </Box>
        <VoteButtons
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          has_upvoted={comment.has_upvoted}
          has_downvoted={comment.has_downvoted}
          postId={comment.id}
          type='comment'
        />
        </Box>
      )}) :
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: [2,1] }}>
          <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold' color='textSecondary'>Help a Fellow Educator Out!</Typography>
          <Typography variant='body1' color='textSecondary'>Be the first to answer and provide guidance.</Typography>
        </Box>
      }
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement='bottom-end'
        transition
        ref={popperRef}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <List>
                <ListItemButton
                  sx={{ padding: 1, gap: 3 }}
                  onClick={handleDeleteComment}
                  disabled={mutationDelete.isPending}
                >
                  <DeleteOutline fontSize='small'/>    <Typography fontSize='small'>Delete Comment</Typography>
                </ListItemButton>
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}