// src/components/PrivateRoute.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { addUser, removeUser } from "../store/features/authSlice";
import { handleFailure } from "../utils/toast";

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://apnanotes-cdn4.onrender.com/check-auth", {
      method: "GET",
      credentials: "include", // 🧠 required to send cookie
    })
      .then(async (res) => {
        if (res.status == 401) {
          const { error } = await res.json();
          handleFailure(error);
          throw new Error("Not authenticated");
        }
        return res.json();
      })
      .then((data) => {
        setAuth(true);
        dispatch(addUser(data.user));
      })
      .catch(() => {
        setAuth(false);
        dispatch(removeUser());
      });
  }, []);

  if (auth === null)
    return (
      <div className="flex items-center justify-center h-[88dvh]">
        <span className="text-xl font-semibold text-white relative after:content-['...'] after:absolute after:left-full after:animate-pulse">
          Loading
        </span>
      </div>
    );
  if (!auth) return <Navigate to="/user/login" replace />;

  return children;
};

export default PrivateRoute;
