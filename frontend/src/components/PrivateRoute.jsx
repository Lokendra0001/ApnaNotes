// src/components/PrivateRoute.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { addUser, removeUser } from "../store/features/authSlice";
import { handleFailure } from "../utils/toast";
import { Triangle } from "react-loader-spinner";

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
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#AC74FF"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  if (!auth) return <Navigate to="/user/login" replace />;

  return children;
};

export default PrivateRoute;
