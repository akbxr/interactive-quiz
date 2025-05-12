"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { encodeUrlData, generateRandomString } from "@/lib/utils";
import { motion } from "framer-motion";
import InfiniteScrollGallery from "@/components/infinite-scroll-gallery";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <motion.div
        className="container mx-auto px-4 py-8 md:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.header className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-medium">nordastro</span>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <motion.div className="space-y-4" variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                A revolutionary astrology book written just for you
              </h1>
              <p className="text-lg text-gray-700">
                Take a 1-minute quiz to get your unique birth chart reading for
                self-growth, better relationships, life path, and career goals.
              </p>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              <p className="font-medium">Start by selecting your gender:</p>
              <div className="flex flex-wrap gap-3">
                <motion.div variants={itemVariants}>
                  <Link
                    href="/quiz?d=male"
                    className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Male
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/quiz?d=female"
                    className="px-8 py-3 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-500 transition-colors"
                  >
                    Female
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/quiz?d=other"
                    className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors"
                  >
                    Other
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div className="hidden md:block" variants={itemVariants}>
            <InfiniteScrollGallery />
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
