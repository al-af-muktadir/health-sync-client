"use client";
import Lottie from "lottie-react";
// import Image from "next/image";
import logo from "../../../public/Animation - 1749834497886.json";
import { FaFacebook, FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import { Button } from "../ui/button";
// import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Branding */}
        <div>
          <div className="flex -ml-16 items-center justify-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                <span className="text-violet-200">Health </span>
                <span className="text-violet-500"> Sync</span>
              </h2>
            </div>
            <div className=" w-20">
              <Lottie animationData={logo} loop></Lottie>
            </div>
          </div>
          <p className="text-sm font-medium italic ">
            “Empowering care, syncing lives.”
          </p>
          <div className="mt-4 text-sm">
            <p>
              Email:{" "}
              <a href="mailto:info@healthsync.com" className="underline">
                info@healthsync.com
              </a>
            </p>
            <p>Phone: +880 1234 567890</p>
          </div>
          <div className="flex gap-4 mt-4 text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Navigate</h3>
          <ul className="space-y-2 text-sm">
            {/* <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>

            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li> */}
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/cookies" className="hover:underline">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="/disclaimer" className="hover:underline">
                Disclaimer
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Optional or Subscribe */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
          <p className="text-sm mb-2">Subscribe to our newsletter</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 text-black rounded"
          />
          <Button className="mt-2 px-4 py-2  text-sm">Subscribe</Button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-700" />

      {/* Footer Bottom */}
      <p className="text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Health Sync. All rights reserved.
      </p>
    </footer>
  );
}
