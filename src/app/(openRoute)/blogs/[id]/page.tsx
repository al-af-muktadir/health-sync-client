"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Lottie from "lottie-react";
import loader from "../../../../../public/Animation - 1749834497886.json";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchBlogById } from "@/components/auth/services/doctorServices";

interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  doctor?: { name: string };
  createdAt?: string;
}

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const data = await fetchBlogById(id as string);
      console.log(id, data);
      setBlog(data);
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Lottie className="w-40" animationData={loader} loop />
      </div>
    );

  if (!blog)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Blog not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-black px-6 md:px-12 py-12 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/blogs">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center text-violet-400 hover:text-violet-300 mb-6"
          >
            <ArrowLeft className="mr-2" /> Back to Blogs
          </motion.div>
        </Link>

        {/* Blog Image */}
        {blog.image && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden shadow-lg mb-8 border border-violet-600/30"
          >
            <Image
              src={blog.image}
              alt={blog.title}
              width={1200}
              height={600}
              className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        )}

        {/* Blog Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-violet-300 mb-4 drop-shadow-md"
        >
          {blog.title}
        </motion.h1>

        {/* Author & Date */}
        <div className="flex justify-between items-center text-gray-400 text-sm mb-8">
          {blog.doctor?.name && <p>✍️ By: {blog.doctor.name}</p>}
          {blog.createdAt && (
            <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
          )}
        </div>

        {/* Blog Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="prose prose-invert max-w-none leading-relaxed text-gray-200"
        >
          {blog.content.split("\n").map((para, index) => (
            <p key={index} className="mb-4">
              {para}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
