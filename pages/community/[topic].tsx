import { useRouter } from "next/router";
import React from "react";
import { CloudIcon } from "@heroicons/react/24/solid";
import PostBox from "../../components/PostBox";
import Feed from "../../components/Feed";
type Props = {};

const Community = (props: Props) => {
  const {
    query: { topic },
  } = useRouter();
  return (
    <div className="h-24 bg-blue-400 p-8">
      <div className="-mx-8 mt-10 bg-white">
        <div className="flex max-w-5xl items-center space-x-4 pb-3">
          <div>
            <CloudIcon className="h-12 w-13" />
          </div>
          <div className="py-2">
            <h1 className="text-3xl font-semibold">
              Welcome to the /{topic} Community
            </h1>
            <p className="text-sm text-gray-400">/{topic}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl pb-10">
        <PostBox community= {topic as string}/>
        <Feed topic= {topic as string}/>
      </div>
    </div>
  );
};

export default Community;
