import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const res = await fetch("http://localhost:4000/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      console.log(error);
      setCommentError(error.message);
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
    </div>
  );
}
