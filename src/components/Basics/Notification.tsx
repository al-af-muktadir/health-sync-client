/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Bell, RotateCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  fetchAppointment,
  fetchNotificationyyy,
} from "../auth/services/userService";
import { PaymentInitiate } from "../auth/services/doctorServices";
import { toast, Toaster } from "sonner";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  // fetch notifications
  const fetchNotifications = async () => {
    const res = await fetchNotificationyyy();
    console.log(res);
    setNotifications(res.data);
  };

  const handlePaymentRetry = async (tran_id: any) => {
    const appRes = await fetchAppointment(tran_id);

    if (appRes.success) {
      const res = await PaymentInitiate(appRes.data.id);
      if (res?.data.paymentUrl) {
        window.location.href = res?.data.paymentUrl;
      } else {
        toast.error("Failed to get payment link");
      }
    }
    console.log();
  };
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications</p>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex justify-between items-center gap-2"
            >
              <span className="text-sm">
                {n.message} {n.appointment.doctor.name}
              </span>
              <Button
                size="sm"
                className="bg-violet-500 text-white flex items-center gap-1"
                onClick={() => handlePaymentRetry(n.transactionId)}
              >
                <RotateCw size={14} /> Retry
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
      <Toaster />
    </DropdownMenu>
  );
};
