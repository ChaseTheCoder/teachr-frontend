'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Skeleton } from '@mui/material';
import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Post from '../../../components/post/post';
import { getDataNoToken, getDataWithParamsNoToken } from '../../../services/unauthenticatedApiCalls';
import FeedAd from '../../../components/googleAdsense/feed-ad';
import { ActivityLoading, ActivityLoadingMultiSize } from '../../../components/activityLoading';
import { profile } from 'console';
import { IProfile } from '../../../types/types';
import { getData } from '../../../services/authenticatedApiCalls';
import { useUserContext } from '../../../context/UserContext';

export default function InfiniteFeed() {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [batchProfiles, setBatchProfiles] = useState([]);
  const observer = useRef<IntersectionObserver>();
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

  const { data: batchProfileData, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesFeed', userIds],
    queryFn: () => userIds.length > 0 ? getDataWithParamsNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: !!userIds,
  });

  useEffect(() => {
    if(!isLoadingProfileData && !isFetchingProfileData && !isLoadingUser) {
      if(profileData && profileData.id) {
        setProfileParam(`&user_id=${profileData.id}`);
      } else {
        setProfileParam('');
      }
    }
  }, [profileData, isFetchingProfileData, isLoadingProfileData, isLoadingUser]);


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
    queryKey: ['postsFeed'],
    queryFn: ({ pageParam }) => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/feed/?page=${pageParam}&page_size=8${profileParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
    enabled: profileParam !== null,
  })

  useEffect(() => {
    if (feedPosts) {
      const ids: string[] = [];
      feedPosts.pages.forEach(page => {
        page.forEach(post => {
          if (!ids.includes(post.user)) {
            ids.push(post.user);
          }
        });
      });
      setUserIds(ids);
    }
  }, [feedPosts, isFetching, isLoading]);

  useEffect(() => {
    if (batchProfileData) {
      setBatchProfiles(prevProfiles => [...prevProfiles, ...batchProfileData]);
    }
  }, [batchProfileData]);

  const lastPostElementRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage]);

  if(status === 'error') { return <div>Error</div> }

  if(status === 'pending') { return <ActivityLoadingMultiSize /> }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      {feedPosts?.pages.map((page, pageIndex) => (
      <React.Fragment key={`page-${pageIndex}`}>
        {page?.map((post, index) => {
        const userProfile = batchProfiles?.find(profile => profile.id === post.user);
        if (!userProfile) {
          return <Skeleton key={`feed-loading-${post.id}`} variant="rectangular" width="100%" height={118} />;
        }
        if (feedPosts.pages.length === pageIndex + 1) {
          return (
          <div ref={lastPostElementRef} key={post.id}>
            <Post post={post} profile={userProfile} />
          </div>
          );
        } else {
          return (
          <Post key={`feed-${post.id}`} post={post} profile={userProfile} />
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