/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  fetchAllBlog,
  updatePublish,
} from "@/components/auth/services/doctorServices";

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetchAllBlog();
      if (res.success) {
        setBlogs(res?.data?.data || []);
      } else {
        toast.error("Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePublishToggle = async (blogId: string) => {
    const blog = blogs.find((b) => b.id === blogId);
    if (!blog) return;

    const newStatus = !blog.isPublished;

    // Optimistically update UI
    setBlogs((prev) =>
      prev.map((b) => (b.id === blogId ? { ...b, isPublished: newStatus } : b))
    );
    setUpdating(blogId);

    // Create the status object
    const statusUpdate = {
      isPublished: newStatus,
    };

    try {
      const res = await updatePublish(blogId, statusUpdate);
      if (res.success) {
        toast.success(
          `Blog ${newStatus ? "published" : "unpublished"} successfully`
        );
      } else {
        toast.error(res.message || "Update failed");
        // Revert on failure
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === blogId ? { ...b, isPublished: !newStatus } : b
          )
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update blog status");
      // Revert on error
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blogId ? { ...b, isPublished: !newStatus } : b
        )
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-violet-400">All Blogs</h1>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead className="bg-[#1f0f3f]">
            <tr>
              {["Title", "Content", "Doctor", "Published", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-violet-300 border-b border-gray-700"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-violet-200">
                  Loading...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-violet-200">
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="hover:bg-[#2f1b5f] transition-colors duration-200"
                >
                  <td className="px-4 py-3 border-b border-gray-700">
                    {blog.title}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700 truncate max-w-xs">
                    {blog.content}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700">
                    {blog.doctor?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700">
                    {blog.isPublished ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-700">
                    <Button
                      size="sm"
                      variant={blog.isPublished ? "destructive" : "default"}
                      disabled={updating === blog.id}
                      className={`${
                        blog.isPublished
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-violet-600 hover:bg-violet-700"
                      } text-white font-semibold`}
                      onClick={() => handlePublishToggle(blog.id)}
                    >
                      {updating === blog.id
                        ? "Updating..."
                        : blog.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
