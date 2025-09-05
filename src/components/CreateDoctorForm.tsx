/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { createDoctor } from "@/components/auth/services/userService";

const CreateDoctorForm: React.FC = () => {
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
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/specialties`
        );
        const data = await res.json();
        setSpecialties(data?.data || []);
      } catch {
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
      form.reset();
      setImageFile([]);
      setPreviewImage([]);
    } else {
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12">
      <div className="w-full max-w-4xl px-4">
        <Card className="bg-[#0f0f17] border border-[#2e2a50] shadow-[0_30px_60px_-10px_rgba(99,54,223,0.3)] rounded-2xl overflow-hidden">
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              Register New Doctor
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                noValidate
              >
                {/* Your form fields here */}
                {/* ... copy your existing fields ... */}

                <ImageUploader
                  setImageFile={setImageFile}
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage}
                />

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

export default CreateDoctorForm;
