import LoginForm from "@/components/auth/Login/LoginForm";
import { Suspense } from "react";
// import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
