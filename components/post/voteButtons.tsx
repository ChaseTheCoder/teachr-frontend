'use client'

import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useUserContext } from '../../context/UserContext';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getData, postOrPatchData } from '../../services/authenticatedApiCalls';
import { IProfile } from '../../types/types';

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  has_upvoted: boolean | null;
  has_downvoted: boolean | null;
  postId: string;
  type: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ type, upvotes, downvotes, has_upvoted, has_downvoted, postId }) => {
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const queryClient = new QueryClient();
  const [disabled, setDisabled] = useState(true);
  const [upvotesCount, setUpvotesCount] = useState(upvotes);
  const [downvotesCount, setDownvotesCount] = useState(downvotes);
  const [hasUpvoted, setHasUpvoted] = useState(has_upvoted);
  const [hasDownvoted, setHasDownvoted] = useState(has_downvoted);

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

  const handleVote = async (voteType: string) => {
    if(!profileData) return;
    if(voteType === 'upvote') {
      if(hasUpvoted) {
        setUpvotesCount(upvotesCount - 1);
        setHasUpvoted(false);
      } else {
        setUpvotesCount(upvotesCount + 1);
        setHasUpvoted(true);
        if(hasDownvoted) {
          setDownvotesCount(downvotesCount - 1);
          setHasDownvoted(false);
        }
      }
    } else {
      if(hasDownvoted) {
        setDownvotesCount(downvotesCount - 1);
        setHasDownvoted(false);
      } else {
        setDownvotesCount(downvotesCount + 1);
        setHasDownvoted(true);
        if(hasUpvoted) {
          setUpvotesCount(upvotesCount - 1);
          setHasUpvoted(false);
        }
      }
    }
    await postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/${type}/${postId}/vote/`, 'PATCH', { action: voteType, user: profileData.id });
  }

  useEffect(() => {
    if(profileData) {
      setDisabled(false);
    }
  }, [profileData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={.25}>
      <IconButton
        size='small'
        sx={{ padding: '2px' }}
        disabled={disabled}
        onClick={() => handleVote('upvote')}
      >
        <ArrowUpwardIcon color={hasUpvoted ? 'success' : 'inherit'} fontSize='small' />
      </IconButton>
      <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary' >{upvotesCount - downvotesCount}</Typography>
      <IconButton
        size='small'
        sx={{ padding: '2px' }}
        disabled={disabled}
        onClick={() => handleVote('downvote')}
      >
        <ArrowDownwardIcon color={hasDownvoted ? 'warning' : 'inherit'} fontSize='small' />
      </IconButton>
    </Box>
  );
};

export default VoteButtons;

