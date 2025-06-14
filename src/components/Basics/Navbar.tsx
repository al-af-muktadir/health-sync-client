"use client";
import Lottie from "lottie-react";
import Link from "next/link";
import React from "react";
import logo from "../../../public/Animation - 1749834497886.json";
import { Button } from "../ui/button";

const Navbar = () => {
  const links = [
    { path: "Home", url: "/" },
    { path: "About us", url: "/aboutus" },
    { path: "Book Appointment", url: "/book-appointment" },
  ];
  return (
    <div className="flex mt-6 justify-between mx-auto  items-center max-w-11/12">
      <div className="flex justify-center items-center gap-2 ">
        <p className="font-bold text-2xl">
          {" "}
          <span className="text-violet-200"> Health </span>
          <span className="text-violet-500">Sync</span>
        </p>
        <Lottie className="w-10" animationData={logo} loop></Lottie>
      </div>
      <div className="space-x-10">
        {links.map((link) => (
          <Link
            className="font-bold hover:border-b-2 pb-1 border-b-violet-500 "
            key={link.url}
            href={link.url}
          >
            {link.path}
          </Link>
        ))}
      </div>
      <div>
        <div className="space-x-5">
          <Link href="/login">
            <Button className="bg-violet-200 text-black font-bold">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="font-bold"> Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
