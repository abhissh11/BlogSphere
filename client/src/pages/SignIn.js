import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields!"));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post("http://localhost:4000/api/auth/signin", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      const data = await res.data;

      dispatch(signInSuccess(data));
      navigate("/");

      return data;
    } catch (error) {
      dispatch(signInFailure(error.message));
      if (error) {
        dispatch(signInFailure(error.response.data.message));
        // setErrMessage(error.response.data.message);
        // setLoading(false);
      }
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
              This the Blog Sphere app created by Abhishek in order to learn
              MERN Stack.... This the Blog Sphere app created by Abhishek in
              order to learn MERN Stack
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
            </form>
            <div className="flex gap-3 mt-5 text-sm ">
              <span>Don't have an Account?</span>
              <Link to={"/sign-up"} className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errMessage && (
              <Alert className="mt-5" color={"failure"}>
                {errMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
