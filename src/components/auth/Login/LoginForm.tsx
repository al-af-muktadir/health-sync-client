"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Lottie from "lottie-react";
import login from "../../../../public/Animation - 1749797235281.json";
import { cn } from "@/lib/utils";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { loginUser } from "../services";
import { toast } from "sonner";
// import { useState } from "react";
import { BsGoogle } from "react-icons/bs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/api/Context/UserContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { refetchUser } = useUser();
  const form = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  // const router=useRouter();
  // const [submitting, setIsSubmitting] = useState(false);
  const submitting = form.formState.isSubmitting;
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Form submitted with data:", process.env.NEXT_PUBLIC_BASE_URL);

    try {
      console.log(data);

      const result = await loginUser(data);
      console.log(result);
      if (result.success) {
        toast.success("Login successful!");
        if (redirect) {
          router.push(redirect);
          refetchUser();
        } else {
          refetchUser();
          router.push("/");
        }
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid items-center justify-center p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Health Sync Account
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          value={field.value || ""}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {submitting ? "Logging in ..." : "Login"}
                </Button>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-[#18181B] relative hidden md:block">
            <Lottie animationData={login} loop />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default LoginForm;
