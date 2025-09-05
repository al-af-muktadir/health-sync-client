/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { generateRoom } from "../auth/services/userService";
import { useUser } from "@/api/Context/UserContext";
import { UpdateStatus } from "../auth/services/doctorServices";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; // icon for cross button (optional)

export default function VideoCallPage({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [callData, setCallData] = useState<any>(null);
  const { user } = useUser();
  // const { user } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);
  const activeUsersRef = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    const joinCall = async () => {
      try {
        const response = await generateRoom(appointmentId);
        if (response.success) {
          setCallData(response.data);
        }
      } catch (error) {
        console.error("Error joining call:", error);
      }
    };
    joinCall();
  }, [appointmentId]);

  useEffect(() => {
    if (!callData || !containerRef.current || !user) return;

    const appID = parseInt(process.env.NEXT_PUBLIC_ZEEGO_APP_ID!);
    const serverSecret = process.env.NEXT_PUBLIC_ZEEGO_SERVER_SECRET!;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      callData.roomID,
      user.email,
      callData.name,
      7200
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [
        {
          name: "Shareable link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            callData.roomID,
        },
      ],
      scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showRoomTimer: true,
      maxUsers: 4,
      showScreenSharingButton: true,

      onUserJoin: (userList: any) => {
        activeUsersRef.current = userList.length;
        if (activeUsersRef.current === 2) {
          UpdateStatus(appointmentId, { status: "INPROGRESS" });
        }
      },
      onUserLeave: (userList: any) => {
        activeUsersRef.current = userList.length;
        if (activeUsersRef.current === 0) {
          UpdateStatus(appointmentId, { status: "COMPLETED" });
        }
      },
    });

    return () => {
      try {
        zpRef.current?.destroy();
      } catch (err) {
        console.warn("Cleanup failed:", err);
      }
    };
  }, [callData, user, appointmentId]);

  if (!callData) return <div>Loading video call...</div>;

  const handleLeave = () => {
    try {
      zpRef.current?.destroy();
    } catch (err) {
      console.warn("Leave failed:", err);
    }
    router.push(`/${user.role.toLowerCase()}/view-appointments`);
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Cross Button */}
      <button
        onClick={handleLeave}
        className="absolute top-2 right-2 z-50 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
      >
        <X size={20} />
      </button>

      <div ref={containerRef} className="w-full h-[calc(100vh-4rem)]" />
    </div>
  );
}
