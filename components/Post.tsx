import React, { useState, useEffect } from "react";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { DotSpinner } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { GET_ALL_LIKES_BY_POST_ID } from "../graphql/queries";
import { ADD_LIKE } from "../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";

type Props = {
  post: Post;
};

const Post = ({ post }: Props) => {
  const { data: session } = useSession();
  const [like, setLike] = useState<boolean>();

  const { data, loading } = useQuery(GET_ALL_LIKES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  });

  const [addLike] = useMutation(ADD_LIKE, {
    refetchQueries: [GET_ALL_LIKES_BY_POST_ID, "getLikesByPostId"],
  });

  const onLike = async (isLike: boolean) => {
    if (!session) {
      toast.error("Need to be logged in");
      return;
    }

    if (like && isLike) return;
    if (like == false && !isLike) return;

    await addLike({
        variables: {
            post_id: post.id,
            username: session.user?.name,
            like: isLike,
        }
    })
}

  useEffect(() => {
    const likes: Like[] = data?.getLikesByPostId;
    const like = likes?.find(
      (like) => like.username == session?.user?.name
    )?.like
    setLike(like);

  }, [data]);

  const displayLikes = (data: any) => {
    const likes: Like[] = data?.getLikesByPostId
    const displayNumber = likes?.reduce(
        (total, i) => (i.like ? (total += 1) : (total -=1)),
        0
    )

    return displayNumber;
  }

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <DotSpinner size={100} color="#00008B" />
      </div>
    );
  return (
    <Link
      href={`/post/${post.id}`}
      className="flex cursor-pointer rounded-md border border-gray-300 bg-white
    shadow-sm hover:border-gray-600"
    >
      <div
        className="flex flex-col items-center justify-start space-y-1 rounded-l-md
      bg-gray-50 p-4 text-gray-400"
      >
        <HandThumbUpIcon
          onClick={() => onLike(true)}
          className={`voteButtons hover:text-blue-400 ${like && 'text-blue-400'}`}
        />
        <p className="text-xs font-bold text-black">{displayLikes(data)}</p>
        <HandThumbDownIcon
          onClick={() => onLike(false)}
          className={`voteButtons hover:text-red-400 ${like === false && 'text-red-400'}`}
        />
      </div>
      <div className="p-3 pb-1">
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-400">
            <Link href={`/community/${post.community[0]?.topic}`}>
              <span className="font-bold text-black hover:text-blue-400 hover:underline">
                /{post.community[0]?.topic}{" "}
              </span>
            </Link>
            - Posted by {post.username} <TimeAgo date={post.created_at} />
          </p>
        </div>
        <div className="py-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2 text-sm font-light">{post.body}</p>
        </div>
        <img className="w-full" src={post.image} alt=""></img>
        <div className="flex space-x-4 text-gray-400">
          <div
            className="flex items-center space-x-1 text-sm font-semibold p-2 hover:bg-gray-100 
          cursor-pointer rounded-sm"
          >
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            <p className="hidden sm:inline">{post.comment.length}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Post;
