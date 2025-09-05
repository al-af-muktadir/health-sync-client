"use client";
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/Animation - 1749834497886.json"; // add your Lottie JSON
import { Button } from "../ui/button";
import { useUser } from "@/api/Context/UserContext";

const AboutUs = () => {
  const { user } = useUser();
  return (
    <section className="relative bg-black text-white py-20 overflow-hidden">
      {/* Glowing Circles Background */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-violet-600 rounded-full opacity-30 animate-pulse blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-500 rounded-full opacity-30 animate-pulse blur-3xl"></div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 relative z-10">
        {/* Lottie Animation */}
        <div className="lg:w-1/2 w-full mb-10 lg:mb-0 flex justify-center">
          <div className="w-64 h-64">
            {" "}
            {/* smaller logo size */}
            <Lottie animationData={animationData} loop={true} />
          </div>
        </div>

        {/* Text Content */}
        <div className="lg:w-1/2 w-full lg:pl-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-wide glow-text">
            Welcome to <span className="text-violet-400">HealthSync</span>
          </h2>
          <p className="text-lg lg:text-xl mb-6 leading-relaxed text-gray-300">
            HealthSync is your ultimate health companion! Book appointments,
            start video consultations, and let our AI-powered system predict
            diseases and suggest the right doctors. Experience health care with
            speed, intelligence, and convenience.
          </p>

          {/* Features */}
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"></span>
              <span>Seamless Appointment Booking</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></span>
              <span>High-Quality Video Consultations</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></span>
              <span>AI Disease Prediction & Doctor Recommendations</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom Glow Text CSS */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px #a78bfa, 0 0 20px #8b5cf6, 0 0 30px #7c3aed,
            0 0 40px #6d28d9;
        }
        .glow-btn {
          box-shadow: 0 0 10px #a78bfa, 0 0 20px #8b5cf6, 0 0 30px #7c3aed,
            0 0 40px #6d28d9;
          transition: all 0.3s ease-in-out;
        }
        .glow-btn:hover {
          box-shadow: 0 0 20px #a78bfa, 0 0 40px #8b5cf6, 0 0 60px #7c3aed,
            0 0 80px #6d28d9;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
