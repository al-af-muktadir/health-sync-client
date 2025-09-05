"use client";

import { CheckCircle2, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full rounded-2xl border border-violet-600/40 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400 mb-4" />
        <h1 className="text-3xl font-extrabold text-white">
          Payment Successful
        </h1>
        <p className="mt-2 text-gray-300">
          Thank you! Your appointment is now confirmed.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-2.5 font-semibold shadow-md hover:from-violet-700 hover:to-pink-700"
        >
          <Home className="h-5 w-5" /> Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
