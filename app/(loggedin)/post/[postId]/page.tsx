'use client'

import UserPost from "./userPost";
import { Grid } from "@mui/material";
import Comments from "./comments";
import PostComment from "./postComment";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { getData } from "../../../../services/authenticatedApiCalls";
import { useUser } from "@auth0/nextjs-auth0/client";
import { IProfile } from "../../../../types/types";
import { useEffect, useState } from "react";
import { useUserContext } from "../../../../context/UserContext";

export default function QuestionId({
  params,
}: {
  params: { postId: string };
}) {
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const queryClient = new QueryClient();
  
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

  if(isLoadingUser || isLoadingProfileData) return null;
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={10}>
        <UserPost
          postId={params.postId}
          currentUserId={profileData?.id}
        />
        {user && <PostComment postId={params.postId} />}
        {/* <PostComment postId={params.postId} /> */}
        <Comments
          postId={params.postId}
          currentUserId={profileData?.id}
        />
      </Grid>
    </Grid>
  );
}