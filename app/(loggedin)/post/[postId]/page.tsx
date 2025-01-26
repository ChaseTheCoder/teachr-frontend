import PostLayout from "./layout";
import { getDataNoToken } from "../../../../services/unauthenticatedApiCalls";

export async function generateMetadata({ params }) {
  const postId = params.postId;
  const post = await getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/post/${postId}/`);
  return {
    title: `${post.title} - Teacher Lounge`,
    description: post.body.substring(0, 160),
    keywords: 'teaching, education, teacher lounge, post, discussion',
  };
}

export default function Page({
  params,
}: {
  params: { postId: string };
}) {

  return (
    <div>
      <PostLayout params={params} />
    </div>
  );
}