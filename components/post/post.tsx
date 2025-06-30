import { Box, Typography, Popper, IconButton, Fade, List, ListItemButton, Paper, PopperPlacementType, CircularProgress } from '@mui/material';
import { DeleteOutline, MoreVert } from '@mui/icons-material';
import React, { useState, useMemo } from 'react';
import { IPost, IProfileBatch } from '../../types/types';
import Link from 'next/link';
import { timeAgo } from '../../utils/time';
import TeacherAvatar from './avatar';
import VoteButtons from './voteButtons';
import CommentCount from './comment';
import Tags from '../tag';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteData } from '../../services/authenticatedApiCalls';

type Props = {
  post: IPost
  profile: IProfileBatch
  adminId?: string | null;
}

export default function Post({ post, profile, adminId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const imageUrl = profile.profile_pic_url ? 
  `${profile.profile_pic_url}?t=${new Date().getTime()}` : 
  undefined;

  const handleClickPopper = 
    (newPlacement: PopperPlacementType) => 
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // Prevent post click handler
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const handleDeletePostInGroup = useMutation({
    mutationFn: async () => {
      setIsLoadingDelete(true);
      return deleteData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${post.id}/?admin_user_id=${adminId}`
      );
    },
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({
          queryKey: ['group', 'posts'],
          exact: false
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'postsFeed'
        })
      ]);
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
    onSettled: () => {
      setIsLoadingDelete(false);
      setOpen(false);
    }
  });

  // Create a stable cache key for the profile image
  const cacheKey = useMemo(() => {
    return `${profile.id}-${profile.profile_pic_url?.split('?')[0]}`;
  }, [profile.id, profile.profile_pic_url]);

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
        position: 'relative', // Add this for popper positioning
        '&:hover': {
          cursor: 'pointer',
          bgcolor: '#fdfdfd',
        }
      }}
      gap={1}
      onClick={(e) => {
        // Prevent navigation if clicking on existing links
        if (!(e.target as HTMLElement).closest('a') && !anchorEl) {
          router.push(`/post/${post.id}`);
        }
      }}
    >
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        sx={{ width: '100%' }}
      >
        {profile &&
          <Link key={`feed-profile-${profile.id}`} href={`/profile/${profile.id}`} passHref>
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
              <TeacherAvatar
                verified={profile?.verified}
                profilePicUrl={profile.profile_pic_url}
                cacheKey={cacheKey}
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
        }
        {adminId && (
          <IconButton 
            onClick={handleClickPopper('bottom-start')}
            size="small"
          >
            <MoreVert fontSize="small" />
          </IconButton>
        )}
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
                    onClick={() => handleDeletePostInGroup.mutate()}
                    disabled={isLoadingDelete}
                  >
                    {isLoadingDelete ? (
                      <CircularProgress size={20} color="error" />
                    ) : (
                      <DeleteOutline fontSize='small'/>
                    )}
                    <Typography fontSize='small'>
                      {isLoadingDelete ? 'Deleting...' : 'Delete Post'}
                    </Typography>
                  </ListItemButton>
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
      <Link
        key={post.id}
        href={`/post/${post.id}`}
        passHref
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
          gap={1}
        >
          <Typography variant='h2' sx={{ fontSize: { xs: 16, sm: 18 }, width: '100%' }} fontWeight='bold'>{post.title}</Typography>
            {post.body && (
            <Box
              sx={{ 
              fontSize: { xs: 12, sm: 14 },
              color: '#424242',
              margin: 0,
              width: '100%',
              lineHeight: 1.4,
              '& a': {
                color: 'blue',
                textDecoration: 'underline',
              },
              '& *': {
                margin: 0,
              }
              }}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
            )}
        </Box>
      </Link>
      <Tags group={post.group} tags={post.tags} grades={post.grades} />
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
  )
}