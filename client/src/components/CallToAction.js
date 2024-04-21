import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  return (
    <div
      className="flex flex-col sm:flex-row border border-teal-500 p-3 justify-center 
    items-center rounded-tl-3xl rounded-br-3xl"
    >
      <div className="flex-1 justify-center flex flex-col ">
        <h2 className="text-2xl">Want to collaborate or have a project?</h2>
        <p className="text-gray-500 my-2">Checkout the contact options </p>
        <a
          href="https://www.linkedin.com/in/abhishek-kumar-0b6b1a211/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full "
        >
          <Button
            gradientDuoTone={"purpleToPink"}
            className="rounded-tl-xl rounded-bl-none w-full"
          >
            Visit my LinkedIn
          </Button>
        </a>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://static-cse.canva.com/blob/1218229/rawpixel669610unsplash1.jpg"
          alt="img"
          className=" border-2 border-teal-500 rounded-tl-3xl rounded-br-3xl "
        />
      </div>
    </div>
  );
}
