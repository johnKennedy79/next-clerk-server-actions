import { db } from "@/lib/db.js";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  //get all data from posts
  const result = await db.query(`SELECT * FROM all_data`);
  const posts = result.rows;
  // get user info by user_id in post
  const getUsers = async () => {
    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        const userId = post.user_id;
        const response = await clerkClient.users.getUser(userId);
        return { ...post, user: response };
      })
    );
    return postsWithUsers;
  };

  const postsWithUsers = await getUsers();

  return (
    <div className=" flex flex-col items-center h-full w-screen bg-[#e8e5c3]">
      <h2 className="text-center mt-28 text-[#cd950c] text-5xl">Home</h2>
      <nav className="flex items-center w-full justify-evenly">
        <Link
          className="border-double border-[#cd950c] border-8 outline-8 h-16 w-24 bg-[#002349] text-[#cd950c] text-2xl text-center mt-4"
          href="/"
        >
          Home
        </Link>
        <Link
          className="border-double text-center border-[#cd950c] border-8 outline-8 h-16 w-24 bg-[#002349] text-[#cd950c] text-2xl mt-4"
          href="/posts"
        >
          Posts
        </Link>
      </nav>
      {postsWithUsers.map((post) => (
        <div key={post.id} className="w-3/4 mt-4">
          <h2>Posted by: {post.user ? post.user.username : "Unknown User"}</h2>
          <h2>Category: {post.category}</h2>
          <h1>Title: {post.title}</h1>
          <p>Post: {post.content}</p>
          <p>Tags: {post.tags}</p>
        </div>
      ))}
    </div>
  );
}
