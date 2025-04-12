'use client'

import { Grid } from "@mui/material";
import { useUserContext } from "../../../../context/UserContext";
import UserPost from "./userPost";
import Comments from "./comments";

export default function PostLayout({
  params
}: {
  params: { postId: string };
}) {
  const { isLoadingUser, profileData, isLoadingProfile } = useUserContext();

  if(isLoadingUser || isLoadingProfile) return (null);
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={10}>
        <UserPost
          postId={params.postId}
          currentUserId={profileData?.id}
        />
        <Comments
          postId={params.postId}
          currentUserId={profileData?.id}
        />
      </Grid>
    </Grid>
  );
}