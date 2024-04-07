import React from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="font-semibold text-3xl my-5 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user-img"
            className="rounded-full w-full h-full object-cover
        border-8 border-gray-500"
          />
        </div>
        <TextInput
          type="username"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="name@blogSphere"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          defaultValue={"********"}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5 flex justify-between">
        <span className="cursor-pointer hover:underline">Delete Account</span>
        <span className="cursor-pointer hover:underline">Sign Out</span>
      </div>
    </div>
  );
}
