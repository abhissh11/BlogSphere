import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Modal, TableBody } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { server_URL } from "../utils/constants";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  // console.log(userPosts);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`${server_URL}/api/user/getUsers`, {
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      getUsers();
    }
  }, [currentUser._id]);

  // show more
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `${server_URL}/api/user/getUsers?startIndex=${startIndex}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${server_URL}/api/user/delete/${userIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
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
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable Classname="shadow-md">
            <Table.Head>
              <Table.HeadCell> Date Created</Table.HeadCell>
              <Table.HeadCell> User Image</Table.HeadCell>
              <Table.HeadCell> Username</Table.HeadCell>
              <Table.HeadCell> Email </Table.HeadCell>
              <Table.HeadCell> Admin </Table.HeadCell>
              <Table.HeadCell> Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover rounded-full bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
        <p>You have no Users Yet!</p>
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
              Are you sure! <br /> You want to delete this user?
            </h3>
            <div className=" flex justify-center gap-6">
              <Button color={"failure"} onClick={HandleDeleteUser}>
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
