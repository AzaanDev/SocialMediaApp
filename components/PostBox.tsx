import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { LinkIcon, CameraIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_COMMUNITY } from "../graphql/mutations";
import { GET_COMMUNITY_BY_TOPIC, GET_ALL_POSTS } from "../graphql/queries";
import client from "../apollo-client";
import toast from "react-hot-toast";

type Props = {
  community?: string;
};

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  Community: string;
};

const PostBox = ({ community }: Props) => {
  const { data: session } = useSession();
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, "getPostList"],
  });
  const [addCommunity] = useMutation(ADD_COMMUNITY);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading("Creating new Post...");
    try {
      const {
        data: { getCommunityListByTopic },
      } = await client.query({
        query: GET_COMMUNITY_BY_TOPIC,
        variables: { topic: community || formData.Community },
      });
      const communityExists = getCommunityListByTopic.length > 0;

      if (!communityExists) {
        const {
          data: { insertCommunity: newCommunity },
        } = await addCommunity({
          variables: {
            topic: formData.Community,
          },
        });
        const image = formData.postImage || "";
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            community_id: newCommunity.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
      } else {
        const image = formData.postImage || "";
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            community_id: getCommunityListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
      }
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("Community", "");
      toast.success("Created new post", {
        id: notification,
      });
    } catch (e) {
      console.error(e);
      toast.error("Error cannot create post", {
        id: notification,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-16 z-50 rounded-md bg-white border border-gray-500 p-2"
    >
      <div className="flex items-center space-x-3">
        <input
          {...register("postTitle", { required: true })}
          disabled={!session}
          className="bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1"
          type="text"
          placeholder={
            session
              ? community
                ? `Create a post in /${community}`
                : "Create a new Post"
              : "Sign in to Post"
          }
        ></input>
        <CameraIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && "text-blue-300"
          }`}
        />
        <LinkIcon className="h-6 text-gray-300 cursor-pointer" />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("postBody")}
              type="text"
              placeholder="Text (optional)"
            ></input>
          </div>

          {!community && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Community:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("Community", { required: true })}
                type="text"
                placeholder="Community Name"
              ></input>
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("postImage")}
                type="text"
                placeholder="Image link"
              ></input>
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>Title is required</p>
              )}
              {errors.Community?.type === "required" && (
                <p>Community is required</p>
              )}
            </div>
          )}
          {!!watch("postTitle") && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default PostBox;
