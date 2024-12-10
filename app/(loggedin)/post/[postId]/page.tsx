'use client'

import UserPost from "./userPost";
import { Grid, Stack } from "@mui/material";
import Comments from "./comments";
import PostComment from "./postComment";

export default function QuestionId({
  params,
}: {
  params: { postId: string };
}) {
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={10}>
        <UserPost
          postId={params.postId}
        />
        <PostComment postId={params.postId} />
        <Comments postId={params.postId} />
      </Grid>
    </Grid>
  );
}