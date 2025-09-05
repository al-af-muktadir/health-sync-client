// import { Button } from "@/components/ui/button";

import { Banner } from "@/components/Basics/Banner";
import HomeBlogsSection from "@/components/Basics/BlogCard";
import { WhyChooseUs } from "@/components/Basics/WhyChoose";
// import WhyChooseUs from "@/components/Basics/WhyChoose";

export default function Home() {
  return (
    <div>
      <Banner />
      <HomeBlogsSection></HomeBlogsSection>
      <WhyChooseUs />
    </div>
  );
}
