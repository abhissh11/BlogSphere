import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { server_URL } from "../utils/constants";

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  //handle signout
  const handleSignout = async () => {
    try {
      const res = await fetch(`${server_URL}/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=dash"}>
              <Sidebar.Item
                icon={HiChartPie}
                active={tab === "dash" || !tab}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              className="mb-2"
              as="div"
            >
              Profile
            </Sidebar.Item>
            {currentUser.isAdmin && (
              <Link to={"/dashboard?tab=posts"}>
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
            )}
            {currentUser.isAdmin && (
              <>
                <Link to={"/dashboard?tab=users"}>
                  <Sidebar.Item
                    active={tab === "users"}
                    icon={HiOutlineUserGroup}
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </Link>
                <Link to={"/dashboard?tab=comments"}>
                  <Sidebar.Item
                    active={tab === "comments"}
                    icon={HiAnnotation}
                    as="div"
                  >
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )}
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              as="div"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
