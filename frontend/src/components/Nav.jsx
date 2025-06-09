import { FaPaperPlane, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Nav = () => {
  const user = useSelector((state) => state.auth?.user?.payload);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/", active: true },
    { name: "login", path: "/user/login", active: !user },
    { name: "Signup", path: "/user/signup", active: !user },
    { name: "AddNote", path: "/addnote", active: !!user },
    {
      name: user?.username,
      profileImg: user?.profileImg,
      path: "/user/profile",
      active: !!user,
    },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="text-white min-h-[11dvh]  sticky top-0 z-50 bg-gray-900 w-full border-b border-white/30 md:px-4">
      <div className="flex justify-between items-center h-[11vh] px-3 md:px-0">
        {/* Logo */}
        <NavLink to="/" className="text-3xl font-bold flex items-center gap-2">
          <FaPaperPlane className="text-2xl " />
          <span>
            Apna
            <span className="bg-gradient-to-br from-purple-500 to-indigo-300 bg-clip-text text-transparent">
              Note
            </span>
          </span>
        </NavLink>

        {/* Hamburger for mobile */}
        <button onClick={toggleMenu} className="md:hidden text-xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          {links
            .filter((link) => link.active)
            .map((link, i) => (
              <NavLink
                key={i}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-md font-semibold transition ${
                    isActive &&
                    link.path != "/user/profile" &&
                    "bg-white text-black"
                  }
                  `
                }
              >
                <div className="flex items-center gap-1 ">
                  {link.name === user?.username ? (
                    link?.profileImg ? (
                      <img
                        src={link.profileImg}
                        className="w-7 h-7 rounded-full mr-1"
                        alt="Profile"
                      />
                    ) : (
                      <FaUser />
                    )
                  ) : (
                    link.name
                  )}
                </div>
              </NavLink>
            ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden relative  flex flex-col items-center border-b-[1px] border-white/30 w-full bg-gray-900 px-2 pb-4 ">
          {links
            .filter((link) => link.active)
            .map((link, i) => (
              <NavLink
                key={i}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 mt-2 rounded-md font-semibold transition ${
                    isActive ? "bg-white text-black" : "text-white"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  {link.name === user?.username ? (
                    link?.profileImg ? (
                      <>
                        <img
                          src={`http://localhost:3000${link.profileImg}`}
                          className="w-7 h-7 rounded-full"
                          alt="Profile"
                        />
                        {link.name}
                      </>
                    ) : (
                      <FaUser />
                    )
                  ) : (
                    link.name
                  )}
                </div>
              </NavLink>
            ))}
        </div>
      )}
    </header>
  );
};

export default Nav;
