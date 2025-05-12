"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { QuizResult } from "@/lib/types";
import { ArrowLeft, Share2 } from "lucide-react";

interface ResultsScreenProps {
  result: QuizResult | null;
}

export default function ResultsScreen({ result }: ResultsScreenProps) {
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    // Get the current URL to share with others
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  if (!result) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${result.title} Result`,
          text: `Check out my ${result.title} result from the quiz!`,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback if share failed or was cancelled
        copyToClipboard();
      }
    } else {
      // For browsers that don't support navigator.share
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 py-6"
    >
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">{result.title}</h1>
        {result.subtitle && (
          <p className="text-muted-foreground">{result.subtitle}</p>
        )}
      </div>

      {result.image && (
        <div className="flex justify-center">
          <div className="w-48 h-48 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
            <div className="text-6xl">{result.image}</div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-center">{result.description}</p>

        {result.recommendations && (
          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-lg">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-yellow-100 p-1 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  </div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button
          className="py-6 text-base rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share My Result
        </Button>

        <Button
          variant="outline"
          className="py-6 text-base rounded-full"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Take Quiz Again
        </Button>
      </div>
    </motion.div>
  );
}
