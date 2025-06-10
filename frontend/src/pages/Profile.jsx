import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
  FaBiohazard,
  FaLink,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { handleSuccess, handleFailure } from "../utils/toast.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/features/authSlice.js";
import { removeUser } from "../store/features/authSlice";
import { Delete } from "../components/index";

const Profile = () => {
  // Sample user data - in a real app, this would come from state or props
  const [user, setUser] = useState(null);
  const [hideBtn, setHideBtn] = useState(true);
  const [isAvator, setIsAvator] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const profileImgFile = watch("profileImg");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://apnanotes-cdn4.onrender.com/user/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log("User Error");
        return;
      }

      setUser(data.user);
      dispatch(addUser(data.user));
      setValue("username", data.user.username);
      setValue("email", data.user.email);
      setValue("bio", data.user.bio);
    } catch (error) {
      handleFailure(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleFormSubmit = async (data) => {
    setLoader(true);
    try {
      const res = await fetch(
        "https://apnanotes-cdn4.onrender.com/user/editProfile",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        console.log("Res error");
      }
      const result = await res.json();
      handleSuccess(result.message);
      setHideBtn(true);
      await fetchUser();
    } catch (error) {
      handleFailure(error);
    }
    setLoader(false);
  };

  const changeAvator = async (data) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("profileImg", data.profileImg[0]);
    formData.append("user_id", user._id);
    await fetch("https://apnanotes-cdn4.onrender.com/user/changeAvator", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((msg) => {
        handleSuccess(msg.msg);
        setIsAvator(false);
        fetchUser();
        setLoader(false);
      })
      .catch((err) => handleFailure(err));
  };

  const handleLogout = async () => {
    try {
      await fetch("https://apnanotes-cdn4.onrender.com/user/logout", {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(removeUser());
          handleSuccess(data.message);
        });
      setTimeout(() => {
        navigate("/user/login");
      }, 500);

      setShowModal(false);
    } catch (error) {
      console.log("Logout Err :", error);
    }
  };

  return (
    <div className="bg-gray-900 p-5 flex flex-col items-center min-h-screen w-full gap-5">
      {/* Header Section */}
      <div className="p-5 flex flex-col w-full gap-1 border-b border-gray-700">
        <h1 className="text-white font-bold text-3xl">Profile</h1>
        <p className="text-gray-400 text-md">
          View and manage your profile information
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between w-full items-start gap-5 max-w-6xl">
        {/* Profile Picture Section */}
        <form
          onSubmit={handleSubmit(changeAvator)}
          className="w-full md:w-1/3 flex flex-col items-center gap-5 p-6 bg-gray-800 rounded-lg shadow-lg"
          encType="multipart/form-data"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={
                  profileImgFile?.[0]
                    ? URL.createObjectURL(profileImgFile[0])
                    : user?.profileImg
                }
                alt="Avator"
                className="w-full h-full object-cover text-white  text-center"
              />
            </div>
            <button className="absolute bottom-2  right-2 bg-gray-600 p-2 rounded-full hover:bg-purple-700 transition ">
              <input
                type="file"
                {...register("profileImg", {
                  onChange: () => setIsAvator(true),
                })}
                accept="image/*"
                title="Select New Avator"
                className="absolute top-0 left-0 w-full h-full opacity-0 "
              />
              <FaCamera className="text-white text-sm " />
            </button>
          </div>
          <h1 className="text-white font-bold text-xl">{user?.username}</h1>
          <p className="text-gray-400 text-center text-sm">
            {user?.bio || "Fronted Dev From XYZ Universtiy."}
          </p>
          <p className="text-gray-500 text-xs">
            {new Date(user?.createdAt).toDateString()}
          </p>

          <button
            className={`flex items-center gap-2 mt-2 px-4 py-2   rounded-md  text-sm transition ${
              isAvator
                ? "bg-gray-200  hover:bg-gray-100 cursor-pointer"
                : "bg-gray-600/20 text-gray-500"
            }`}
            type="submit"
            disabled={!isAvator}
          >
            <FaEdit /> {loader ? "Changing..." : "Change Avator"}
          </button>
        </form>

        {/* Profile Details Section */}
        <div className="w-full md:w-2/3 bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-white font-bold text-xl mb-4">
            Personal Information
          </h1>
          <form
            className="w-full space-y-4"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="username"
                  className="text-gray-300 mb-2 flex items-center gap-2 text-sm"
                >
                  <FaUser className="text-purple-400" /> Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                  disabled={hideBtn}
                  {...register("username")}
                />
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="text-gray-300 mb-2 flex items-center gap-2 text-sm"
                >
                  <FaEnvelope className="text-purple-400" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                  disabled={hideBtn}
                  {...register("email")}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-gray-300 mb-2 flex items-center gap-2 text-sm"
              >
                <FaLink className="text-purple-400" /> Bio
              </label>
              <textarea
                id="bio"
                rows="3"
                className="px-4 py-3 rounded-md bg-gray-700 text-white resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                disabled={hideBtn}
                {...register("bio")}
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              {hideBtn ? (
                <button
                  type="button"
                  className="flex items-center gap-2 mt-2 px-4 py-2 bg-white/80  hover:bg-white  cursor-pointer rounded-md  text-md transition"
                  onClick={() => setHideBtn(false)}
                >
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
                    onClick={() => setHideBtn(true)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
                  >
                    {loader ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Logout Section */}
      <div className="w-full max-w-6xl flex justify-end p-3">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition"
          onClick={() => setShowModal(true)}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <Delete
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        heading="Logout Account"
        query="Are You Sure to Logout Account?"
        btn="Logout"
      />
    </div>
  );
};

export default Profile;
