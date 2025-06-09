import { Outlet } from "react-router-dom";
import { Nav } from "./components/index";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="max-w-8xl bg-gray-900 min-h-[100vh]">
      <Nav />
      <Outlet />
      <ToastContainer
        position="bottom-left"
        autoClose={1200}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastStyle={{
          background: "white",
          color: "black",
          minHeight: "20px",
          borderRadius: "0.5rem",
        }}
        bodyClassName="text-sm font-medium"
      />
    </div>
  );
};

export default App;
