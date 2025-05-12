"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import Image from "next/image";

// Array of image data for the gallery
const galleryData = [
  [
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Astrology book",
      height: 180,
    },
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Person with astrology book",
      height: 260,
    },
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Book pages",
      height: 200,
    },
  ],
  [
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Tarot cards",
      height: 220,
    },
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Person with book",
      height: 180,
    },
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Moon sign book",
      height: 240,
    },
  ],
  [
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Birth chart",
      height: 180,
    },
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Astrology book page",
      height: 220,
    },
    {
      src: "/placeholder.svg?height=400&width=300",
      alt: "Couple with books",
      height: 240,
    },
  ],
];

type ImageItem = {
  src: string;
  alt: string;
  height: number;
};

const ImageColumn = ({ images }: { images: ImageItem[] }) => (
  <div className="space-y-3">
    {images.map((img, index) => (
      <div
        className={`rounded-lg overflow-hidden bg-gray-100`}
        style={{ height: `${img.height}px` }}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={300}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
);

export default function InfiniteScrollGallery() {
  const [scrollY, setScrollY] = useState(0);
  const containerHeight = 680; // Height of one set of content
  const speed = 0.7; // Scroll speed

  // Animate the scroll position
  useAnimationFrame(() => {
    setScrollY((prev) => {
      const newPosition = prev + speed;
      // Reset position to create a seamless loop
      return newPosition >= containerHeight ? 0 : newPosition;
    });
  });

  // Generate each gallery block
  const renderGalleryBlock = (yOffset: number) => (
    <motion.div
      className="grid grid-cols-3 gap-3 absolute w-full"
      style={{ y: yOffset }}
    >
      {galleryData.map((column, index) => (
        <ImageColumn key={index} images={column} />
      ))}
    </motion.div>
  );

  return (
    <div className="h-[600px] overflow-hidden relative">
      {/* First copy of the gallery */}
      {renderGalleryBlock(-scrollY)}

      {/* Second copy of the gallery positioned below */}
      {renderGalleryBlock(-scrollY + containerHeight)}

      {/* Third copy for smoother transition */}
      {renderGalleryBlock(-scrollY + containerHeight * 2)}
    </div>
  );
}
