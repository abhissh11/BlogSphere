import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Modal, TableBody } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { server_URL } from "../utils/constants";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  // console.log(userPosts);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(
          `${server_URL}/api/post/getPosts?userId=${currentUser._id}`
        );
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      getPosts();
    }
  }, [currentUser._id]);

  // show more
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `${server_URL}/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${server_URL}/api/post/deletePost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-400
    dark:scrollbar-track-teal-100 dark:scrollbar-thumb-teal-400"
    >
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable ClassName="shadow-md">
            <Table.Head>
              <Table.HeadCell> Date updated</Table.HeadCell>
              <Table.HeadCell> Post Image</Table.HeadCell>
              <Table.HeadCell> Post Title</Table.HeadCell>
              <Table.HeadCell> Cateogry </Table.HeadCell>
              <Table.HeadCell> Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500 font-medium  hover:underline cursor-pointer"
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 w-full text- sm self-center py-7 hover:text-teal-300"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have not posted anything Yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto " />

            <h3 className="mb-5 text-gray-500 dark:text-gray-400 text-lg text-center">
              Are you sure! <br /> You want to delete this post?
            </h3>
            <div className=" flex justify-center gap-6">
              <Button color={"failure"} onClick={HandleDeletePost}>
                Yes! I'm Sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModal(false)}>
                No, Canceal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
