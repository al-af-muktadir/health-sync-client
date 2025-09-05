"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
// import { cn } from "@/lib/utils";
import ImageUploader from "@/components/Reusable/ImageUploader";
import { createSpecialty } from "@/components/auth/services/adminServices";
// import { createSpecialty } from "@/components/auth/services/userService"; // Make sure this function is defined

const CreateSpecialty = () => {
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const [imageFile, setImageFile] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ title: data.title }));
    if (imageFile[0]) formData.append("file", imageFile[0]);
    console.log("Form Data:", formData);
    try {
      const res = await createSpecialty(formData);
      console.log("Response:", res);
      if (res?.success) {
        toast.success("Specialty created successfully!");
        form.reset();
        setImageFile([]);
        setPreviewImage([]);
      } else {
        toast.error("Failed to create specialty.");
      }
    } catch (err) {
      toast.error("Server error.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4">
      <div className="w-full max-w-2xl">
        <Card className="relative z-10 bg-[#0f0e25] border border-[#2f2a50] shadow-md rounded-2xl">
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Create New Specialty
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        Specialty Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#1f1b3f] text-white ring-1 ring-[#514bcf] focus:ring-2 focus:ring-[#7c6fff]"
                          placeholder="e.g. Neurology"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <ImageUploader
                  setImageFile={setImageFile}
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage}
                />

                <Button
                  type="submit"
                  className="w-full bg-transparent border border-[#6b5fd0] text-white hover:bg-[#1f1b3f] py-3 rounded-xl"
                >
                  {isSubmitting ? "Creating..." : "Create Specialty"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSpecialty;
