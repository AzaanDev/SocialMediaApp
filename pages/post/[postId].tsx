import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GET_POST_BY_ID } from "../../graphql/queries";
import { ADD_COMMENT } from "../../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import Post from "../../components/Post";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";

type Props = {};

type FormData = {
  comment: string;
};

const PostPage = (props: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data } = useQuery(GET_POST_BY_ID, {
    variables: {
      post_id: router.query.postId,
    },
  });
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, "getPostById"],
  });



  const post: Post = data?.getPostById;

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading("Posting Comment");
    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: formData.comment,
      },
    });

    setValue("comment", "");
    toast.success("Comment Posted", {
      id: notification,
    });
  });
  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as {" "}
          <span className="text-blue-500">{session?.user?.name}</span>
        </p>
        <form onSubmit={onSubmit} className="flex flex-col space-y-2">
          <textarea
            {...register("comment")}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none
            disabled:bg-gray-50"
            placeholder={session ? "Comment" : "Sign in to comment"}
          ></textarea>
          <button
            type="submit"
            className="rounded-full bg-blue-500 text-white p-3 disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>
      <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />
        {post?.comment?.map((comment) => (
          <div
            className="relative flex items-center space-x-2 space-y-5"
            key={comment.id}
          >
           
            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">
                  {comment.username}  {'   '}
                </span>
                <TimeAgo date={comment.created_at}></TimeAgo>
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
