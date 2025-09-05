/* eslint-disable @typescript-eslint/no-explicit-any */
import VideoCallPage from "@/components/Basics/VideoCallPageClient";

// interface Props {
//   params: {
//     id: string;
//   };
// }

export default function Page({ params }: any) {
  return <VideoCallPage appointmentId={params.id} />;
}
