'use client'

import UserPost from "./userPost";
import { Grid, Stack } from "@mui/material";
import Comments from "./comments";
import PostComment from "./postComment";
import { useQuery } from "@tanstack/react-query";
import { getData } from "../../../../services/authenticatedApiCalls";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function QuestionId({
  params,
}: {
  params: { postId: string };
}) {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const { data: profileData, isLoading: isLoadingProfile, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  });
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={10}>
        <UserPost
          postId={params.postId}
          currentUserId={profileData.id}
        />
        <PostComment postId={params.postId} />
        <Comments
          postId={params.postId}
          currentUserId={profileData.id}
        />
      </Grid>
    </Grid>
  );
}