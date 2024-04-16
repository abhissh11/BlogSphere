import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [users, setUsers] = useState({});
  //   console.log(users);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/user/${comment.userId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/comment/editComment/${comment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: editedContent,
          }),
        }
      );
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-200 text-sm">
      <div className="flex flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 bg-gray-200 object-cover rounded-full"
          src={users.profilePicture}
          alt={users.username}
        ></img>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-sm truncate">
            {users ? `@${users.username}` : "anonymous"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <TextInput
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                gradientDuoTone={"purpleToBlue"}
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                gradientDuoTone={"purpleToBlue"}
                outline
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Canceal
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === currentUser.userId ||
                  currentUser.isAdmin) && (
                  <>
                    <button
                      type="button "
                      onClick={handleEdit}
                      className="text-gray-400 text-sm hover:text-green-400"
                    >
                      Edit
                    </button>
                    <button
                      type="button "
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 text-sm hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
