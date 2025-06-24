'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import Post from '../../../components/post/post';
import { getDataNoToken } from '../../../services/unauthenticatedApiCalls';
import FeedAd from '../../../components/googleAdsense/feed-ad';
import { ActivityLoading, ActivityLoadingMultiSize } from '../../../components/activityLoading';
import { IProfile } from '../../../types/types';
import { getData } from '../../../services/authenticatedApiCalls';
import { useUserContext } from '../../../context/UserContext';

interface InfiniteFeedProps {
  selectedGrades: string[];
  selectedTags: string[];
}

export default function InfiniteFeed({ selectedGrades, selectedTags }: InfiniteFeedProps) {
  const observer = useRef<IntersectionObserver>();
  const { auth0Id, isLoadingUser } = useUserContext();
  const queryClient = useQueryClient();
  const [isProfileParamReady, setIsProfileParamReady] = useState(false);
  const [profileParam, setProfileParam] = useState<string>('');
  const [gradeParams, setGradeParams] = useState<string>('');
  const [tagParams, setTagParams] = useState<string>('');
  const [feedUrl, setFeedUrl] = useState<string>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/feed/`);

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
        setProfileParam(`&user_id=${profileData.id}`);
      } else {
        setProfileParam('');
      }
      setIsProfileParamReady(true);
    }
  }, [profileData, isFetchingProfileData, isLoadingProfileData, isLoadingUser]);

  useEffect(() => {
    if (selectedGrades.length > 0) {
      const params = selectedGrades.map(grade => `&grade_ids=${grade}`).join('');
      setGradeParams(params);
    } else {
      setGradeParams('');
    }
    if (selectedTags.length > 0) {
      const params = selectedTags.map(tag => `&tag_ids=${tag}`).join('');
      setTagParams(params);
    } else {
      setTagParams('');
    }
  }, [selectedGrades, selectedTags]);

  useEffect(() => {
    if (isProfileParamReady) {
      setFeedUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/feed/?page=1${gradeParams}${tagParams}${profileParam}`);
    }
  }, [gradeParams, isProfileParamReady, profileData, profileParam, tagParams]);


  const {
    data: feedPosts,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status,
    ...result
  } = useInfiniteQuery({
    queryKey: ['postsFeed', feedUrl],
    queryFn: ({ pageParam }) => getDataNoToken(feedUrl + `&page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
    enabled: isProfileParamReady && !!feedUrl
  })

  const lastPostElementRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  if(status === 'error') { return <div>Error</div> }

  if(status === 'pending') { return <ActivityLoadingMultiSize /> }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      {feedPosts?.pages.map((page, pageIndex) => (
      <React.Fragment key={`page-${pageIndex}`}>
        {page?.map((post) => {
        if (feedPosts.pages.length === pageIndex + 1) {
          return (
          <div ref={lastPostElementRef} key={post.id}>
            <Post post={post} profile={post.user} />
          </div>
          );
        } else {
          return (
          <Post key={`feed-${post.id}`} post={post} profile={post.user} />
          );
        }
        })}
        <FeedAd key={`ad-${pageIndex}`} />
      </React.Fragment>
      ))}
      {isFetchingNextPage && <ActivityLoading />}
    </Box>
  );
}