"use client";

import { Ban, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full rounded-2xl border border-amber-500/40 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl p-8 text-center"
      >
        <Ban className="mx-auto h-16 w-16 text-amber-400 mb-4" />
        <h1 className="text-3xl font-extrabold text-white">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-gray-300">
          You cancelled the payment. Your appointment is on hold.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Complete payment within{" "}
          <span className="text-white font-semibold">30 minutes</span> to avoid
          automatic cancellation.
        </p>

        <button
          onClick={() => router.push("/payment/retry")}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-amber-500/40 px-5 py-2.5 font-semibold hover:bg-amber-600/10"
        >
          <RefreshCw className="h-5 w-5" /> Retry Payment
        </button>
      </motion.div>
    </div>
  );
}
