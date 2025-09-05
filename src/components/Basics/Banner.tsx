"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import onepic from "@/assets/banner.jpg";
import twopic from "@/assets/baner2.jpg";

import Image from "next/image";
import { useRef } from "react";

export function Banner() {
  const images = [onepic, twopic];

  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    })
  );

  return (
    <div className="max-w-[1800px] mt-20">
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="relative w-full">
              <Image
                src={src}
                alt={`banner-${idx}`}
                priority={idx === 0}
                className="w-full h-[390px] object-cover"
              />
              <span className="absolute inset-0 bg-black/30" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
