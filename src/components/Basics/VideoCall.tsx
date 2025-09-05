"use client";

import { useEffect, useRef } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";

interface Props {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
}

export default function VideoCallComponent({
  appId,
  channelName,
  token,
  uid,
}: Props) {
  const localVideoRef = useRef<HTMLDivElement>(null);

  // Get local mic + camera
  const { microphoneTrack, isLoading: isLoadingMic } =
    useLocalMicrophoneTrack();
  const { cameraTrack, isLoading: isLoadingCam } = useLocalCameraTrack();

  // Remote users
  const remoteUsers = useRemoteUsers();

  // Join channel
  useJoin({ appid: appId, channel: channelName, token, uid });

  // Publish local tracks
  usePublish([microphoneTrack, cameraTrack]);

  // Play local camera once it’s ready
  useEffect(() => {
    if (localVideoRef.current && cameraTrack) {
      cameraTrack.play(localVideoRef.current);
    }
  }, [cameraTrack]);

  if (isLoadingMic || isLoadingCam) return <div>Loading devices...</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4">
        {/* Local video */}
        <div ref={localVideoRef} className="w-64 h-48 bg-black" />

        {/* Remote videos */}
        {remoteUsers.map((user) => (
          <div
            key={user.uid}
            className="w-64 h-48 bg-black"
            ref={(el) => {
              if (el && user.videoTrack) {
                user.videoTrack.play(el);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
