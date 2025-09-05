import VideoCallPage from "@/components/Basics/VideoCallPageClient";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <VideoCallPage appointmentId={params.id} />;
}
