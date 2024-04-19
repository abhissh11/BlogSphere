import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { server_URL } from "./../utils/constants";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const res = await fetch(`${server_URL}/api/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setPostComments([data, ...postComments]);
      }
    } catch (error) {
      console.log(error);
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `${server_URL}/api/comment/getPostComments/${postId}`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setPostComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `${server_URL}/api/comment/likeComment/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPostComments(
          postComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLike: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setPostComments(
      postComments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `${server_URL}/api/comment/deleteComment/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();

        setPostComments(postComments.filter((c) => c._id != commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto py-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as </p>
          <img
            className="h-5 w-5 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt="profile-pic"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-5 text-sm text-teal-500 my-5">
          You must be Login to comment!
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 p-3 rounded-md"
        >
          <TextInput
            placeholder="Add a comment..."
            rows="3"
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm text-gray-500">
              {200 - comment.length} Characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {postComments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments:</p>
            <div className="border border-gray-500  py-1 px-2 rounded-sm">
              <p className="">{postComments.length}</p>
            </div>
          </div>
          {postComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
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
              Are you sure! <br /> You want to delete this comment?
            </h3>
            <div className=" flex justify-center gap-6">
              <Button
                color={"failure"}
                onClick={() => handleDelete(commentToDelete)}
              >
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
