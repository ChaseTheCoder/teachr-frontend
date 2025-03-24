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

interface InfiniteFeedProps {
  selectedGrades: string[];
  selectedTags: string[];
}

export default function InfiniteFeed({ selectedGrades, selectedTags }: InfiniteFeedProps) {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [batchProfiles, setBatchProfiles] = useState([]);
  const observer = useRef<IntersectionObserver>();
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const queryClient = new QueryClient();
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
      setIsProfileParamReady(true);
    }
  }, [profileData, isFetchingProfileData, isLoadingProfileData, isLoadingUser]);

  useEffect(() => {
    console.log('selectedGrades', selectedGrades);
    console.log('selectedTags', selectedTags);
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
    console.log('feedUrl', feedUrl);
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