'use client'

import { useQuery } from "@tanstack/react-query";
import { getData } from "../../../../services/authenticatedApiCalls";
import UserPost from "./userPost";
import { Stack } from "@mui/material";
import Comments from "./comments";

export default function QuestionId({
  params,
}: {
  params: { postId: string };
}) {
  
  return (
    <Stack spacing={2}>
      <UserPost
        postId={params.postId}
      />
      <Comments postId={params.postId} />
    </Stack>
  );
}