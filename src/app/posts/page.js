import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function AddPostPage() {
  const result = await db.query(`SELECT * FROM categories`);
  const cats = result.rows;
  const TagResult = await db.query(`SELECT * FROM tags`);
  const tags = TagResult.rows;
  const user = await currentUser();
  // console.log(user);

  async function handleAddPost(formData) {
    "use server";
    console.log("form action complete");
    const title = formData.get("title");
    const category = formData.get("category");
    const content = formData.get("content");
    const tag = formData.get("tag");

    const newPost = await db.query(
      `INSERT INTO posts (title, content, category_id, user_id ) VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, content, category, user?.id]
    );
    await db.query(`INSERT INTO posts_tags (post_id, tag_id) VALUES ($1, $2)`, [
      newPost.rows[0].id,
      tag,
    ]);

    revalidatePath("/");
    redirect("/");
  }
  return (
    <>
      <SignedIn>
        <main className="flex flex-col items-center h-screen w-screen bg-[#e8e5c3]">
          <header className="text-center mt-28">
            <h2 className=" text-[#cd950c] text-5xl">Add a new post as </h2>
          </header>
          <nav className="flex items-center justify-evenly">
            <Link
              className="border-double  border-[#cd950c] border-8 outline-8 h-16 w-24 bg-[#002349] text-[#cd950c] text-2xl text-center mt-4"
              href="/"
            >
              Home
            </Link>
          </nav>
          <form
            action={handleAddPost}
            className="flex flex-col items-center justify-between mt-4 border-double border-[#cd950c] h-3/5 w-2/3 border-8 outline-8 "
          >
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="add a title to your post..."
            />
            <label for="content">Post Content</label>
            <textarea name="content" placeholder="write your post here..." />
            <select name="category">
              <option>Select Category</option>
              {cats.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select name="tag">
              <option>Select Tag</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <button>Submit</button>
          </form>
        </main>
      </SignedIn>
      <SignedOut>
        <main className="flex flex-col items-center h-screen w-screen bg-[#e8e5c3]">
          <header>
            <h2 className="text-center mt-28 text-[#cd950c] text-5xl">
              You need to be signed in to add a new post
            </h2>
          </header>
          <nav className="flex items-center justify-evenly">
            <Link
              className="border-double border-[#cd950c] border-8 outline-8 h-16 w-24 bg-[#002349] text-[#cd950c] text-2xl text-center mt-8 "
              href="/"
            >
              Home
            </Link>
          </nav>
        </main>
      </SignedOut>
    </>
  );
}
