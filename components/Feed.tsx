import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from "../graphql/queries";
import Post from "../components/Post";

type Props = {
  topic?: string;
};

const Feed = ({ topic }: Props) => {
  const skip = !topic
  const { data: data1} = useQuery(GET_ALL_POSTS, {skip: !skip})
  const { data: data2 } = useQuery(GET_ALL_POSTS_BY_TOPIC, {
    skip: skip,
    variables: {
      topic: topic,
    },
  });
  const posts: Post[] = skip ? data1?.getPostList: data2?.getPostListByTopic;

  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;

/*
  const { data } = !topic
    ? useQuery(GET_ALL_POSTS)
    : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: {
          topic: topic,
        },
      });
*/
