import React from "react";
import { FaGithub, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { LuPopcorn } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
        <div className="flex justify-between px-10 md:gap-20 lg:px-52 pt-10 pb-20 border-t border-red-500">
      <Link to="/" className="flex whitespace-nowrap self-center">
        <LuPopcorn color="red" className="w-7 h-7 sm:w-9 sm:h-9 " />
        <span className="px-1 pb-1 rounded-lg text-white bg-customRed text-xl sm:text-2xl font-semibold flex self-center">
          PICKS
        </span>
      </Link>
      <div className="flex mr-10 gap-5 md:gap-20">
        <div className="">
          <h2 className="text-lg font-semibold">INFORMATION</h2>
          <ul className="text-sm">
            <li>About Us</li>
            <li>Blogs</li>
            <li>Testimonials</li>
            <li>Events</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">SOCIALS</h2>
          <ul className="text-sm">
            <li className="flex">
              <FaInstagram  className="mr-1"/>
              Instagram
            </li>
            <li className="flex">
              <FaLinkedin className="mr-1"/>
              Linked In
            </li>
            <li className="flex">
              <FaGithub className="mr-1"/>
              Github
            </li>
            <li className="flex">
              <FaFacebook className="mr-1"/>
              Facebook
            </li>
          </ul>
        </div>
      </div>
    </div>
      <div className="border-t border-red-700"/>
      <p className="flex justify-center items-center py-5">© 2024 PopcornPicks. All rights reserved.</p>
    </div>
  );
}
