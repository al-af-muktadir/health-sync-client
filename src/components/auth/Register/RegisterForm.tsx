/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ImageUploader from "@/components/Reusable/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import registerGif from "../../../../public/Animation - 1749825754199.json";
// import Lottie from "lottie-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { register } from "../services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [imageFile, setImageFile] = useState<File[] | []>([]);
  const [previewImage, setpreviewImage] = useState<string[] | []>([]);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
    },
  });
  
  const submitting = form.formState.isSubmitting;
  const formData = new FormData();
  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    const patient = {
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
      address: data.address,
    };
    const userInfo = {
      password: data.password,
      patient,
    };
    formData.append("data", JSON.stringify(userInfo) as any);
    formData.append("file", imageFile[0]);
    // console.log(imageFile[0]);
    // console.log(userInfo);
    const res = await register(formData);
    if (res.success) {
      toast.success("User Created Successfully");

      router.push("/login");
    } else {
      toast.error("Something Went Wrong !!");
    }
  };
  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-muted",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-lg min-h-screen shadow-lg">
        <CardContent className="grid grid-cols-1 p-0">
          {/* Right Side Form */}
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-muted-foreground">
                    Register to your Health Sync Account
                  </p>
                </div>

                {/* Name and Email in one row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <ImageUploader
                  setImageFile={setImageFile}
                  setPreviewImage={setpreviewImage}
                  previewImage={previewImage}
                />

                <Button type="submit" className="w-full">
                  {submitting ? "Registering..." : "Register"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
