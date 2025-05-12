"use client"

import { motion } from "framer-motion"

interface ZodiacSignDisplayProps {
  zodiacSign: {
    name: string;
    symbol: string;
    dates: string;
    element?: string;
    traits?: string[];
  } | null;
}

export default function ZodiacSignDisplay({ zodiacSign }: ZodiacSignDisplayProps) {
  if (!zodiacSign) return null;

  return (
    <motion.div 
      key={zodiacSign.name}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="mt-6 text-center"
    >
      <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-5 shadow-sm w-full overflow-hidden relative">
        <div className="absolute -top-6 -right-6 opacity-10 text-9xl text-yellow-400">{zodiacSign.symbol}</div>
        <div className="relative z-10">
          <div className="text-6xl mb-3 text-yellow-500">{zodiacSign.symbol}</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">{zodiacSign.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{zodiacSign.dates}</p>
            
            {zodiacSign.element && (
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-200 text-yellow-800 font-medium">
                  {zodiacSign.element === "Fire" && "🔥"}
                  {zodiacSign.element === "Earth" && "🌎"}
                  {zodiacSign.element === "Air" && "💨"}
                  {zodiacSign.element === "Water" && "💧"}
                  <span className="ml-1">{zodiacSign.element} Element</span>
                </span>
              </div>
            )}
          </div>
        
          {zodiacSign.traits && zodiacSign.traits.length > 0 && (
            <div className="mt-4 relative z-10">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Personality Traits</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {zodiacSign.traits?.map((trait: string, index: number) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="inline-block px-2 py-1 bg-white border border-yellow-200 rounded-md text-xs font-medium text-gray-700 shadow-sm"
                  >
                    {trait}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 