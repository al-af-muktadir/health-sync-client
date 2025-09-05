/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ImageUploader from "@/components/Reusable/ImageUploader";
import {
  createBlogs,
  deleteBlogs,
  fetchMyBlogs,
  updateBlogs,
} from "@/components/auth/services/doctorServices";
import { toast, Toaster } from "sonner";
import Image from "next/image";

export default function DoctorBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File[] | []>([]);
  const [previewImage, setPreviewImage] = useState<string[] | []>([]);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<any>(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  // Loading states
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getMyBlogs = async () => {
    const res = await fetchMyBlogs();
    setBlogs(res.data);
  };

  const createBlog = async () => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    setIsPublishing(true); // start loading
    const formData = new FormData();
    formData.append("data", JSON.stringify({ title, content }));
    if (imageFile[0]) formData.append("file", imageFile[0]);

    try {
      const res = await createBlogs(formData);
      if (res.success) {
        toast.success("Blog created successfully");
        setTitle("");
        setContent("");
        setImageFile([]);
        setPreviewImage([]);
        getMyBlogs();
      } else {
        toast.error("Blog creation failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsPublishing(false); // stop loading
    }
  };

  const deleteBlog = async (id: string) => {
    const res = await deleteBlogs(id);
    if (res.success) {
      toast.success("Blog deleted");
      getMyBlogs();
    } else toast.error("Blog deletion failed");
  };

  const updateBlog = async () => {
    setIsUpdating(true); // start loading
    try {
      const data = { title: editingBlog.title, content: editingBlog.content };
      const res = await updateBlogs(editingBlog.id, data);
      if (res.success) {
        toast.success("Blog updated successfully");
        setOpenModal(false);
        setEditingBlog(null);
        getMyBlogs();
      } else {
        toast.error("Blog update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false); // stop loading
    }
  };

  useEffect(() => {
    getMyBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-purple-950 p-6 text-white">
      {/* Create Blog Section */}
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl p-6 mb-10 rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-wide text-purple-300">
            Create Blog
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/60 text-white border-purple-500 placeholder-gray-400 focus:border-purple-400"
          />
          <textarea
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[130px] bg-black/60 text-white border border-purple-500 rounded-md p-3 placeholder-gray-400 focus:border-purple-400"
          />

          {/* Image Uploader */}
          <ImageUploader
            setImageFile={setImageFile}
            setPreviewImage={setPreviewImage}
            previewImage={previewImage}
          />

          <Button
            onClick={createBlog}
            className="bg-purple-600 hover:bg-purple-700 w-full rounded-xl shadow-md transition-all duration-200"
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish Blog"}
          </Button>
        </CardContent>
      </Card>

      {/* My Blogs Table */}
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl p-6 rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-wide text-purple-300">
            My Blogs
          </h2>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-700 text-purple-300 uppercase text-sm">
                <th className="p-3">Title</th>
                <th className="p-3">Created</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs?.length > 0 ? (
                blogs?.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-gray-700 hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="p-3 font-medium">{blog.title}</td>
                    <td className="p-3">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {blog.isPublished ? (
                        <span className="text-green-400 font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold">
                          Unpublished
                        </span>
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 rounded-lg"
                        onClick={() => {
                          setEditingBlog(blog);
                          setOpenModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-purple-500 hover:bg-purple-600 rounded-lg"
                        onClick={() => {
                          setViewingBlog(blog);
                          setOpenViewModal(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-lg"
                        onClick={() => deleteBlog(blog.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">
                    No blogs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Update Blog Modal */}
      {openModal && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black text-purple-300 border border-purple-600 rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <button
              onClick={() => setOpenModal(false)}
              className="text-purple-400 hover:text-purple-200 float-right font-bold text-lg"
            >
              ×
            </button>
            <div className="space-y-4 mt-2">
              <Input
                value={editingBlog.title}
                onChange={(e) =>
                  setEditingBlog({ ...editingBlog, title: e.target.value })
                }
                placeholder="Blog Title"
                className="bg-black border border-purple-600 text-purple-300 placeholder-purple-400 focus:border-purple-400 w-full"
              />
              <textarea
                value={editingBlog.content}
                onChange={(e) =>
                  setEditingBlog({ ...editingBlog, content: e.target.value })
                }
                placeholder="Blog Content"
                className="w-full min-h-[130px] bg-black border border-purple-600 text-purple-300 placeholder-purple-400 rounded-md p-3 focus:border-purple-400"
              />
              <Button
                onClick={updateBlog}
                className="bg-purple-700 hover:bg-purple-800 w-full rounded-xl shadow-md transition-all duration-200 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Blog Modal */}
      {openViewModal && viewingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black text-purple-300 border border-purple-600 rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <button
              onClick={() => setOpenViewModal(false)}
              className="text-purple-400 hover:text-purple-200 float-right font-bold text-lg"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{viewingBlog.title}</h2>
            {viewingBlog.image && (
              <Image
                src={viewingBlog.image}
                alt={viewingBlog.title}
                width={50}
                height={50}
                className="mb-4 rounded-md w-full object-cover max-h-60"
              />
            )}
            <p className="whitespace-pre-wrap">{viewingBlog.content}</p>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
