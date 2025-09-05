"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getPublishedBlogs } from "@/components/auth/services/doctorServices";
import Lottie from "lottie-react";
import loader from "../../../public/Animation - 1749834497886.json";
import { motion } from "framer-motion";
import Link from "next/link";
import { ImageIcon } from "lucide-react"; // icon for placeholder

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  isPublished: boolean;
  doctor?: { name: string };
}

const HomeBlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getPublishedBlogs();
      setBlogs(data.data.slice(0, 6)); // only first 6 blogs
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Lottie className="w-40" animationData={loader} loop />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-black text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-violet-300 drop-shadow-lg">
        Explore Our Health & Wellness Insights
      </h2>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        Stay informed with the latest tips, expert advice, and research-backed
        articles to improve your well-being.
      </p>

      <div className="mt-12">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No published blogs found.
          </p>
        ) : (
          <>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="rounded-2xl shadow-lg bg-gradient-to-b from-gray-900 to-black border border-violet-500/20 overflow-hidden relative group transition-all duration-300 hover:shadow-violet-400/50 hover:border-violet-400/50">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={500}
                        height={300}
                        className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-52 flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-violet-900 text-violet-200">
                        <ImageIcon className="w-12 h-12 opacity-80 mb-2" />
                        <span className="text-sm opacity-70">
                          No Image Available
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="p-4">
                      <h2 className="text-xl font-bold text-violet-200 drop-shadow-md line-clamp-2">
                        {blog.title}
                      </h2>
                    </CardHeader>
                    <CardContent className="px-4 pb-6">
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {blog.content}
                      </p>
                      {blog.doctor && (
                        <p className="text-xs text-violet-300 mt-3">
                          ✍️ By: {blog.doctor.name}
                        </p>
                      )}
                      <Button
                        className="mt-4 w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold relative overflow-hidden"
                        asChild
                      >
                        <Link href={`/blogs/${blog.id}`}>
                          <span className="relative z-10">Read More →</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/blogs">
                <Button className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold shadow-lg">
                  See More Blogs →
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeBlogsSection;
