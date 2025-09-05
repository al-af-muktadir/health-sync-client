"use client";
import Lottie from "lottie-react";
import Link from "next/link";
import React from "react";
import logo from "../../../public/Animation - 1749834497886.json";
import { Button } from "../ui/button";
import { useUser } from "@/api/Context/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOutIcon } from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "../auth/services";
import { privateRoutes } from "../Reusable/constant";
import { NotificationBell } from "./Notification";

const Navbar = () => {
  const { user, refetchUser, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = async () => {
    await logoutUser();
    refetchUser();
    if (privateRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  const Patinetlinks = [
    { path: "Home", url: "/" },
    { path: "Book Appointment", url: "/book-appointment" },
    { path: "Disease Prediction", url: "/predict-disease" },
    { path: "Health Blog", url: "/blogs" },
    { path: "About us", url: "/about-us" },
  ];

  const DoctorLinks = [
    { path: "Home", url: "/" },
    { path: "Health Blog", url: "/blogs" },
    { path: "Disease Prediction", url: "/predict-disease" },
    { path: "About us", url: "/about-us" },
  ];

  const renderLinks = () => {
    if (isLoading) {
      return (
        <div className="flex space-x-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-5 bg-violet-700/50 rounded animate-pulse"
            ></div>
          ))}
        </div>
      );
    }

    const links = !user || user.role === "PATIENT" ? Patinetlinks : DoctorLinks;

    return links.map((link) => (
      <Link
        key={link.url}
        href={link.url}
        className="font-bold pb-1 border-b-2 border-b-transparent transition duration-300 hover:border-b-violet-500"
        style={{ cursor: "pointer" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textShadow =
            "0 0 4px #8b5cf6, 0 0 8px #7c3aed")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
      >
        {link.path}
      </Link>
    ));
  };

  return (
    <div className="flex mt-6 justify-between mx-auto items-center max-w-11/12 relative z-50">
      {/* Logo */}
      <div className="flex justify-center items-center gap-2">
        <p className="font-bold text-2xl">
          <span className="text-violet-200"> Health </span>
          <span className="text-violet-500">Sync</span>
        </p>
        <Lottie className="w-10" animationData={logo} loop />
      </div>

      {/* Navigation Links */}
      <div className="space-x-10 flex">{renderLinks()}</div>

      {/* User Section */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-6">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-700 animate-pulse"></div>
            <div className="w-24 h-5 rounded bg-violet-700/70 animate-pulse"></div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-6">
            {/* Notification for patient */}
            {user?.role === "PATIENT" && <NotificationBell />}

            {/* User Name */}
            <span
              className="font-bold text-lg text-violet-400 animate-pulse"
              style={{
                textShadow:
                  "0 0 5px #a78bfa, 0 0 10px #8b5cf6, 0 0 15px #7c3aed, 0 0 20px #6d28d9",
              }}
            >
              {user.name}
            </span>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  style={{
                    boxShadow:
                      "0 0 10px #8b5cf6, 0 0 15px #7c3aed, 0 0 20px #a78bfa",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <AvatarImage src={user.profilePhoto} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href={`/${user.role.toLowerCase()}/dashboard`}>
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="text-red-600 font-semibold cursor-pointer"
                >
                  Log out <LogOutIcon className="text-red-600" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex gap-5">
            <Link href="/login">
              <Button className="bg-violet-200 text-black font-bold">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold"> Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
