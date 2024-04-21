import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "./../components/Oauth";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { server_URL } from "../utils/constants";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`${server_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex gap-8 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
          <div className="flex-1">
            {/* left */}
            <Link to={"/"} className="  text-4xl font-bold dark:text-white">
              Blog
              <span
                className="px-2 py-1  bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg
             text-white"
              >
                Sphere
              </span>
            </Link>
            <p className="text-sm mt-5">
              Welcome to blogSphere, your premier destination for insightful
              articles and captivating content! Explore topics like the MERN
              stack, Next.js, and cutting-edge AI advancements. But that's just
              the beginning! Our platform also offers engaging content on life's
              intricacies, movie reviews, and web show highlights.
            </p>
          </div>
          <div className="flex-1">
            {/* Right */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  placeholder="name@yourmail.com"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  placeholder="Ab39@3#"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                gradientDuoTone={"purpleToPink"}
                className="font-semibold text-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size={"sm"} />
                    <span className="pl-3">Loading...</span>{" "}
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-3 mt-5 text-sm ">
              <span>Don't have an Account?</span>
              <Link to={"/sign-up"} className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color={"failure"}>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
