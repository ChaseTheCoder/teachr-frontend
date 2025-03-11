'use client'

import { useQuery } from "@tanstack/react-query";
import { getDataNoToken, getDataWithParamsNoToken } from "../services/unauthenticatedApiCalls";
import Post from "./post/post";
import { useEffect, useState } from "react";
import LoadingIndicator from "./loading";

export default function HomePosts() {
  const [userIds, setUserIds] = useState<string[]>([]);
  const post1 = process.env.NEXT_PUBLIC_HOME_PAGE_POST_1;
  const post2 = process.env.NEXT_PUBLIC_HOME_PAGE_POST_2;
  const post3 = process.env.NEXT_PUBLIC_HOME_PAGE_POST_3;
  const paramaters = '?post_ids=' + post1 + '&post_ids=' + post2 + '&post_ids=' + post3;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/home_page/${paramaters}`;
  console.log(url);

  const { data: posts, isFetching, isLoading, isError } = useQuery({
    queryKey: ['posts_home_page'],
    queryFn: () => getDataNoToken(url),
    staleTime: 1000 * 60 * 60
  })
  console.log(posts);

  const { data: batchProfileData, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesFeed', userIds],
    queryFn: () => userIds.length > 0 ? getDataWithParamsNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: userIds.length > 0,
  });

  useEffect(() => {
    if (posts) {
      const ids: string[] = [];
      posts.forEach(post => {
        if (!ids.includes(post.user)) {
          ids.push(post.user);
        }
      });
      setUserIds(ids);
    }
  }, [posts, isFetching, isLoading]);

  if (isLoading || isFetching) {
    return <LoadingIndicator description='Loading posts...' />
  }

  return (
    <>
      {
        posts.map((post) => {
          const profile = batchProfileData?.find(profile => profile.id === post.user);
          return (
            <Post key={post.id} post={post} profile={profile} homePage />
        )})
      }
    </>
  );
}