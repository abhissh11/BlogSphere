import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  return (
    <div
      className="flex flex-col sm:flex-row border border-teal-500 p-3 justify-center 
    items-center rounded-tl-3xl rounded-br-3xl"
    >
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to Learn Next.Js?</h2>
        <p className="text-gray-500 my-2">Checkout our new Course</p>
        <Button
          gradientDuoTone={"purpleToPink"}
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://www.linkedin.com/in/abhishek-kumar-0b6b1a211/"
            rel="noopener noreferrer"
          ></a>
          Visit my LinkedIn
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230202143636/NEXT-js-tutorial-1.png"
          alt="img"
        />
      </div>
    </div>
  );
}
