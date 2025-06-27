"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { forgotPassword } from "../services";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
  const form = useForm();
  const [submitting, setIsSubmitting] = useState(false);
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    try {
      setIsSubmitting(true);
      const result = await forgotPassword(data);
      if (result.success) {
        setIsSubmitting(false);
        toast.success("Reset link sent to your email!");
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };
  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your email and we’ll send you a reset link.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {submitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
