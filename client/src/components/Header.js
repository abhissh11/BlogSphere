import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { server_URL } from "./../utils/constants";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <>
      <Navbar className="border-b-2">
        <Link
          to={"/"}
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          Blog
          <span className="px-2 py-1  bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white">
            Sphere
          </span>
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <Button
          className="w-12 h-10 bg-blue-300 lg:hidden"
          color="gray"
          pill
          onClick={() => navigate("/search")}
        >
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color={"gray"}
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user-Avatar"
                  img={currentUser.profilePicture}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <DropdownItem>Profile</DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleSignout}>Sign Out</DropdownItem>
              </Link>
            </Dropdown>
          ) : (
            <Link to={"sign-in"}>
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to={"/"} className="font-bold ">
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to={"/about"} className="font-bold ">
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to={"/projects"} className="font-bold ">
              Projects
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
