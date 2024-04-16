import React, { useEffect, useState } from "react";
import moment from "moment";

export default function Comment({ comment }) {
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
        <p className="text-gray-500 mb-2">{comment.content}</p>
      </div>
    </div>
  );
}
