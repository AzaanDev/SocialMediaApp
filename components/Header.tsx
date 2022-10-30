import React from "react";
import {
  ChevronDownIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  SignalIcon,
} from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

type Props = {};

const Header = (props: Props) => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center mx-7 xl:min-w-[300px]">
        <Link href="/">
          <HomeIcon className="h-5 w-5" />
        </Link>
        <Link href="/">
          <p className="ml-2 hidden flex-1 lg:inline cursor-pointer">Home</p>
        </Link>
      </div>
      <form
        className="flex flex-1 items-center space-x-2 rounded-md border border-gray-200
      bg-gray-100 px-3 py-1"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search"
        />
        <button type="submit" hidden />
      </form>

      {session ? (
        <div
          onClick={() => signOut()}
          className="flex items-center border border-gray-100 space-x-2 p-2 cursor-pointer"
        >
          <div className="flex-1 text-md">
            <p className="truncate">{session?.user?.name}</p>
          </div>
          <ChevronDownIcon className="h-5 flex-shrink 0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="flex items-center border border-gray-100 space-x-2 p-2 cursor-pointer"
        >
          <p className="text-gray-400">Login in</p>
        </div>
      )}
    </div>
  );
};

export default Header;
