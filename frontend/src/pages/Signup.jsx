import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaSignInAlt,
  FaLink,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { handleFailure, handleSuccess } from "../utils/toast";
import { useState } from "react";

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const signupHandler = (data) => {
    setLoader(true);
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profileImg", data.profileImg[0]); // important: first file

    fetch("https://apnanotes-cdn4.onrender.com/user/signup", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        handleSuccess(data.message);
        localStorage.setItem("email", JSON.stringify(data.user.email));
        setLoader(false);
        navigate("/user/login");
      })
      .catch((err) => handleFailure(error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-14">
      <div className="w-full max-w-md bg-gray-800 p-7 py-5  rounded-xl shadow-lg flex flex-col items-center gap-2.5">
        <h2 className="self-start text-3xl mb-3  font-bold text-white">
          Signup
        </h2>

        <form
          onSubmit={handleSubmit(signupHandler)}
          className="flex flex-col gap-8 w-full"
          encType="multipart/form-data"
        >
          {/* ProfileImg */}
          <div className="flex flex-col">
            <label
              htmlFor="profileImg"
              className="text-gray-300 mb-1 flex items-center gap-2"
            >
              <FaLink /> Profile Img :
            </label>
            <input
              type="file"
              placeholder="Choose ProfileImg"
              name="profileImg"
              className="px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("profileImg")}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-gray-300 mb-1 flex items-center gap-2"
            >
              <FaUser /> Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your Username"
              className="px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("username", { required: true })}
              required
            />
          </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition duration-200"
          >
            <FaSignInAlt /> {loader ? "Signing..." : "Sign Up"}
          </button>
        </form>
        <p className="text-white">
          Already have an Account?{" "}
          <span
            onClick={() => navigate("/user/login")}
            className="text-blue-400 cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
