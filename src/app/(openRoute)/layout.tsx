import Footer from "@/components/Basics/Footer";
import Navbar from "@/components/Basics/Navbar";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="min-h-[calc(100vh-463px)] my-14 container mx-auto px-5 lg:px-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
