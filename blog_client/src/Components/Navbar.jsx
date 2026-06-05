import React, { useState } from 'react'

import {
  FaBlog,
  FaHome,
  FaPenNib,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa'

import { Link } from 'react-router-dom'

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  // Navbar Links
  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />
    },

    {
      name: "Write Blog",
      path: "/create-blog",
      icon: <FaPenNib />
    },

    {
      name: "Login",
      path: "/login",
      icon: <FaSignInAlt />
    },

    {
      name: "Sign Up",
      path: "/signup",
      icon: <FaUserPlus />
    }
  ]

  return (

    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer"
        >

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl shadow-md">

            <FaBlog className="text-white text-xl" />

          </div>

          <div>

            <h1 className="text-2xl font-extrabold text-black">
              MyBlogs
            </h1>

            <p className="text-xs text-gray-500">
              Share your ideas with world
            </p>

          </div>

        </Link>

        {/* Search */}
        <div className="hidden lg:flex items-center bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl w-[360px]">

          <FaSearch className="text-blue-600" />

          <input
            type="text"
            placeholder="Search blogs..."
            className="bg-transparent outline-none px-3 w-full text-sm text-black placeholder:text-gray-500"
          />

        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">

          {
            navLinks.map((item, index) => (

              <Link
                key={index}
                to={item.path}

                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300

                ${item.name === "Sign Up"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105"
                    : "text-black hover:bg-gray-100"
                  }
                `}
              >

                <span className={`text-lg

                ${item.name === "Sign Up"
                    ? "text-white"
                    : "text-blue-600"
                  }
                `}>

                  {item.icon}

                </span>

                <span>
                  {item.name}
                </span>

              </Link>

            ))
          }

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-blue-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >

          {
            menuOpen ? <FaTimes /> : <FaBars />
          }

        </button>

      </div>

      {/* Mobile Menu */}
      {
        menuOpen && (

          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-5 space-y-4">

            {
              navLinks.map((item, index) => (

                <Link
                  key={index}
                  to={item.path}

                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300

                  ${item.name === "Sign Up"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "text-black hover:bg-gray-100"
                    }
                  `}
                >

                  <span className={`text-lg

                  ${item.name === "Sign Up"
                      ? "text-white"
                      : "text-blue-600"
                    }
                  `}>

                    {item.icon}

                  </span>

                  <span>
                    {item.name}
                  </span>

                </Link>

              ))
            }

            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl">

              <FaSearch className="text-purple-600" />

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none px-3 w-full text-sm text-black"
              />

            </div>

          </div>
        )
      }

    </nav>
  )
}