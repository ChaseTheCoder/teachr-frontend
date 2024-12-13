import { Avatar, Box, Fade, IconButton, List, ListItemButton, Paper, Popper, PopperPlacementType, Skeleton, Typography } from '@mui/material';
import React, {  } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { deleteData, getData } from '../../../../services/authenticatedApiCalls';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DeleteOutline } from '@mui/icons-material';

type Props = {
  postId: String
  currentUserId: String | undefined;
}

export default function UserPost({ postId, currentUserId }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClickPopper =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };
  const { data: post, isFetching, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/`),
    staleTime: 1000 * 60 * 60,
  })
  
  const { data: profile, isFetching: isFetchingProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useQuery({
    queryKey: ['posterProfile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile/${post.user}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!post,
  })

  const mutationDelete = useMutation({
    mutationFn: () => {
      return deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${post.id}}`);
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
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            alt="Profile Image"
            sx={{ width: { xs: 30, md: 35 }, height: { xs: 30, md: 35 }, marginRight: '1rem' }}
          />
          <Typography sx={{ fontSize: { xs: 16, sm: 18 } }}>{profile.teacher_name}</Typography>
          <Typography sx={{ fontSize: { xs: 16, sm: 18 }, paddingLeft: 1 }} color='textSecondary'>{profile.title}</Typography>
        </Box>
        {(currentUserId !== undefined && currentUserId === post.user) &&
          <IconButton onClick={handleClickPopper('bottom-start')}>
            <MoreVert fontSize='small' />
          </IconButton>
        }
      </Box>
      <Typography variant='h2' sx={{ fontSize: { xs: 22, sm: 26 } }} fontWeight='bold'>{post.title}</Typography>
      {post.body && <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>{post.body}</Typography>}
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