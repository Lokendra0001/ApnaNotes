import React, { useEffect, useState } from "react";
import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { handleSuccess } from "../utils/toast.js";

const Login = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const [alerType, setAlertType] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (data) => {
    setLoader(true);
    try {
      const response = await fetch(
        "https://apnanotes-cdn4.onrender.com/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        setMsg(resData.error || "Login failed");
        setAlertType("error");
      } else {
        setMsg(resData.message || "Login failed");
        setAlertType("success");
        handleSuccess(resData.message);
        setTimeout(() => navigate("/"), 1000);
      }
      setLoader(false);
    } catch (error) {
      setMsg("Something went wrong. Please try again.");
      setAlertType("error");
    }
  };

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem("email"));
    if (email) setValue("email", email);
  }, []);

  return (
    <div className="min-h-[88dvh] flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full  max-w-sm bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center mb-6 gap-4 w-full">
          <h2 className="self-start text-3xl  font-bold text-white">Login</h2>
          {msg && (
            <Alert
              severity={alerType}
              className="w-full"
              onClose={() => setMsg("")}
            >
              {msg}
            </Alert>
          )}
        </div>

        <form
          onSubmit={handleSubmit(loginHandler)}
          className="flex flex-col gap-8 w-full"
        >
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-gray-300 mb-1 flex items-center gap-2"
            >
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", { required: true })}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-300 mb-1 flex items-center gap-2"
            >
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: true })}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer  text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition duration-200"
          >
            <FaSignInAlt /> {loader ? "Signing..." : "Sign In"}
          </button>
        </form>
        <p className="text-white">
          Don't have an Account?{" "}
          <span
            onClick={() => navigate("/user/signup")}
            className="text-blue-400 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
