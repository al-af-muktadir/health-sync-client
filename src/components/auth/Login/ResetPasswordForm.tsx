// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const formSchema = z.object({
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function ResetPasswordPage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const token = searchParams.get("token");

//   const [message, setMessage] = useState("");

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: { password: "" },
//   });

//   const onSubmit = async (values: { password: string }) => {
//     const res = await fetch("NEXT_PUBLIC_BASE_URL/auth/reset-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         id,
//         token,
//         password: values.password,
//       }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       setMessage("✅ Password reset successful. You can now log in.");
//     } else {
//       setMessage(`❌ ${data?.error || "Something went wrong"}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted p-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>New Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Enter new password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full">
//                 Reset Password
//               </Button>
//               {message && (
//                 <p className="text-sm text-center pt-2 text-muted-foreground">{message}</p>
//               )}
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
