/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ImageUploader from "@/components/Reusable/ImageUploader";
import { useRouter } from "next/navigation";

import { createDoctor } from "@/components/auth/services/userService";

const CreateDoctor = ({ className, ...props }: React.ComponentProps<"div">) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      registrationNumber: "",
      experience: 0,
      gender: "MALE",
      appointmentFee: 0,
      qualification: "",
      currentWorkingPlace: "",
      designation: "",
      specialtyId: "",
    },
  });

  const [imageFile, setImageFile] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/specialties`
        );
        const data = await res.json();
        setSpecialties(data?.data || []);
      } catch (err) {
        toast.error("Failed to fetch specialties");
      }
    };
    fetchSpecialties();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const doctor = {
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
      address: data.address,
      registrationNumber: data.registrationNumber,
      experience: Number(data.experience),
      gender: data.gender,
      appointmentFee: Number(data.appointmentFee),
      qualification: data.qualification,
      currentWorkingPlace: data.currentWorkingPlace,
      designation: data.designation,
      specialtyId: data.specialtyId,
    };

    const payload = { password: data.password, doctor };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (imageFile[0]) formData.append("file", imageFile[0]);

    const res = await createDoctor(formData);

    if (res?.success) {
      toast.success("Doctor registered successfully!");

      // Reset form and image preview
      form.reset();
      setImageFile([]);
      setPreviewImage([]);

      // Optional: redirect if needed
      // router.push("/admin/manage-users/manage-doctor");
    } else {
      toast.error("Registration failed!");
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-black py-12",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-4xl px-4">
        <Card className="relative z-10 bg-[#0f0f17] border border-[#2e2a50] shadow-[0_30px_60px_-10px_rgba(99,54,223,0.3)] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[#4f3fbf]/10 to-transparent" />
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              Register New Doctor
            </h2>
            <p className="text-center text-sm text-gray-400 mb-8">
              Create a new doctor profile to onboard them in the system.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                noValidate
              >
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Dr. ......."
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            placeholder="doctor@example.com"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="••••••••"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#6b5fd0] focus:ring-2 focus:ring-[#7c6fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="contactNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+8801XXXXXXXXX"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#6b5fd0] focus:ring-2 focus:ring-[#7c6fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Hospital Street, City"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="registrationNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Registration No.
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="REG-123456"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 4 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    name="experience"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Experience (Years)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="5"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="appointmentFee"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Appointment Fee
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="250"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 5 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    name="qualification"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Qualification
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="MBBS, MD"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="currentWorkingPlace"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Current Workplace
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="City Hospital"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 6 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    name="designation"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Designation
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Cardiologist"
                            className="bg-[#1f1b3f] text-white ring-1 ring-[#6b5fd0] focus:ring-2 focus:ring-[#7c6fff] rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="specialtyId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Specialty
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full bg-[#1f1b3f] text-white p-2 rounded-lg ring-1 ring-[#5f4ec8] focus:ring-2 focus:ring-[#8f7fff] outline-none"
                          >
                            <option value="">Select specialty</option>
                            {specialties.map((spec) => (
                              <option key={spec.id} value={spec.id}>
                                {spec.title}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender */}
                <FormField
                  name="gender"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Gender</FormLabel>
                      <div className="flex gap-4">
                        {["MALE", "FEMALE"].map((g) => (
                          <label
                            key={g}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition border",
                              field.value === g
                                ? "bg-[#4f3fbf] text-white border-[#6f5fd0]"
                                : "bg-[#1f1b3f] text-gray-400 border-[#2f2a50] hover:border-[#6b5fd0]"
                            )}
                          >
                            <input
                              type="radio"
                              value={g}
                              className="sr-only"
                              checked={field.value === g}
                              onChange={() => field.onChange(g)}
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Image uploader */}
                <ImageUploader
                  setImageFile={setImageFile}
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage}
                />

                {/* Submit */}
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6b5fd0] to-[#8f7fff] text-white font-semibold shadow-md hover:brightness-105 py-3 rounded-xl"
                  >
                    {isSubmitting ? "Registering..." : "Create Doctor"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateDoctor;
