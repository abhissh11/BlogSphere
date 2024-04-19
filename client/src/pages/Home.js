import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "./../components/CallToAction";
import PostCard from "./../components/PostCard";
import { Button, Spinner } from "flowbite-react";
import { server_URL } from "../utils/constants";

const Home = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch(`${server_URL}/api/post/getPosts`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPosts(data.posts);
          setLoading(false);
        }
        // setPosts(data.posts);
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3  max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold font-mono lg:text-5xl">
          Welcome to blogSphere - <br />{" "}
          <span className=""> Where Ideas Take Flight...</span>
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm lg:w-2/3">
          Explore a myriad of topics ranging from technology trends to travel
          escapades, from culinary adventures to philosophical musings. Whether
          you're seeking practical advice, thought-provoking insights, or simply
          a good read, blogSphere has something for everyone. Join our vibrant
          community of writers and readers, where diversity is celebrated and
          opinions are welcomed. Share your stories, engage in discussions, and
          expand your horizons with each click.
        </p>

        <Link to={"/search"}>
          <Button
            gradientDuoTone={"purpleToPink"}
            outline
            className="text-xl font-mono font-semibold"
          >
            View all blogs
          </Button>
        </Link>
      </div>
      <div className="p-5 bg-lime-200 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl p-3 flex flex-col mx-auto gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center ">
              Recent Posts
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 font-semibold hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
