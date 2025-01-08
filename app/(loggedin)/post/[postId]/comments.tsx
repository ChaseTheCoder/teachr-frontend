import { Avatar, Box, Divider, Fade, IconButton, List, ListItemButton, Paper, Popper, PopperPlacementType, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { deleteData, getData, getDataWithParams } from '../../../../services/authenticatedApiCalls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteOutline, MoreVert } from '@mui/icons-material';
import Link from 'next/link';
import { timeAgo } from '../../../../utils/time';
import { getDataNoToken, getDataWithParamsNoToken } from '../../../../services/unauthenticatedApiCalls';

type Props = {
  postId: string
  currentUserId: String | undefined;
}

export default function Comments({ postId, currentUserId }: Props) {
  const popperRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [commentId, setCommentId] = useState<string | null>(null);

  const handleClickPopper =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
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
    
  const { data: comments, isFetching: isFetchingComments, isLoading: isLoadingComments, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/comments/`),
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
    queryFn: () => userIds.length > 0 ? getDataWithParamsNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: userIds.length > 0,
  })

  const mutationDelete = useMutation({
    mutationFn: () => {
      return deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/comment/${commentId}/`);
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

  if (isLoadingBatchProfiles || isFetchingBatchProfiles || isLoadingComments || isFetchingComments) return (
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
        const teacherName = userProfile?.teacher_name ?? 'Unknown Teacher';
        const title = userProfile?.title ?? 'Unknown User';
        const userId = userProfile?.id ?? '';

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
          <Stack
            divider={<Divider/>}
            spacing={3}
          >
              <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link href={`/profile/${userId}`} passHref>
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
                        <Avatar
                          alt="Profile Image"
                          sx={{ width: { xs: 30, md: 35 }, height: { xs: 30, md: 35 }, marginRight: '.5rem' }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} fontWeight='bold'>{teacherName ?? 'User not found'}</Typography>
                            <Typography sx={{ fontSize: { xs: 12, sm: 14 }, paddingLeft: 1 }} color='textSecondary'>{title ?? ''}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>{timeAgo(comment.timestamp)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                  {(currentUserId !== undefined && currentUserId === comment.user) &&
                    <IconButton onClick={handleClickPopper('bottom-end')}>
                      <MoreVert fontSize='small' />
                    </IconButton>
                  }
                </Box>
                <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold'>{comment.title}</Typography>
                {comment.body && <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>{comment.body}</Typography>}
              </Box>
          </Stack>
          <Popper
            sx={{ zIndex: 1200 }}
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
            ref={popperRef}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <List>
                    <ListItemButton
                      sx={{ padding: 1, gap: 3 }}
                      onClick={() => {
                        setCommentId(comment.id);
                        handleDeleteComment();
                      }}
                    >
                      <DeleteOutline fontSize='small'/>   <Typography fontSize='small'>Delete Comment</Typography>
                    </ListItemButton>
                  </List>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      )}) :
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: [2,1] }}>
          <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold' color='textSecondary'>Help a Fellow Educator Out!</Typography>
          <Typography variant='body1' color='textSecondary'>Be the first to answer and provide guidance.</Typography>
        </Box>
      }
    </>
  )
}