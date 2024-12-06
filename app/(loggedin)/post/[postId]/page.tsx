'use client'

import { useQuery } from "@tanstack/react-query";
import { getData } from "../../../../services/authenticatedApiCalls";
import UserPost from "./userPost";
import { Box, Stack } from "@mui/material";
import Comments from "./comments";

export default function QuestionId({
  params,
}: {
  params: { postId: string };
}) {
  const { data: post, isFetching, isLoading, isError } = useQuery({
    queryKey: ['post', params.postId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${params.postId}/`),
    staleTime: 1000 * 60 * 60,
  })
  
  return (
    <Stack spacing={2}>
      {!isFetching && !isLoading && !isError && post && post.id && 
        <UserPost
          post={post}
        />
      }
      <Comments postId={params.postId} />
    </Stack>
  );
}