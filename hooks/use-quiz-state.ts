"use client";

import { useRouter } from "next/navigation";
import {
  useQueryState,
  useQueryStates,
  parseAsJson,
  parseAsInteger,
  parseAsString,
  createParser,
} from "nuqs";
import { encodeUrlData, decodeUrlData, extractUrlParameters } from "@/lib/utils";

// Create a custom parser for our answers format
const answersParser = createParser({
  parse: (str) => {
    try {
      return JSON.parse(str) as Record<string, string[]>;
    } catch (e) {
      return {};
    }
  },
  serialize: (value) => JSON.stringify(value),
});

// Create a parser for our obfuscated data
const obfuscatedDataParser = createParser({
  parse: (str) => {
    try {
      // Check if it's a simple gender string (from homepage)
      if (['male', 'female', 'other'].includes(str)) {
        return { g: str };
      }
      
      // Remove random prefix (first 4 characters) for complex data
      const actualData = str.substring(4);
      return decodeUrlData(actualData);
    } catch (e) {
      return {};
    }
  },
  serialize: (value) => {
    // Special case for only gender
    if (Object.keys(value).length === 1 && value.g && ['male', 'female', 'other'].includes(value.g)) {
      return value.g;
    }
    
    // Generate random prefix (4 chars) for complex data
    const randomPrefix = Math.random().toString(36).substring(2, 6);
    return randomPrefix + encodeUrlData(value);
  }
});

export function useQuizState(quizId: string) {
  const router = useRouter();

  // Use a single obfuscated data parameter instead of multiple parameters
  const [obfuscatedData, setObfuscatedData] = useQueryState(
    "d",
    obfuscatedDataParser.withDefault({})
  );

  // Extract actual state from obfuscated data
  const currentQuestionIndex = obfuscatedData?.q ?? 0;
  const answers = obfuscatedData?.a ?? {};
  const resultId = obfuscatedData?.r ?? "";
  const showResults = obfuscatedData?.sr === 1;
  const gender = obfuscatedData?.g ?? "";

  // Function to update obfuscated data
  const updateObfuscatedData = (updates: Record<string, any>) => {
    setObfuscatedData((prev: Record<string, any> | null) => ({
      ...(prev || {}),
      ...updates
    }));
  };

  // Function to handle option selection
  const handleOptionSelect = (
    questionId: string,
    optionId: string,
    selected: boolean,
    multiSelect: boolean
  ) => {
    const currentAnswers = answers || {};
    const currentSelections = currentAnswers[questionId] || [];
    let newAnswers;

    if (multiSelect) {
      // For multi-select questions
      if (selected) {
        newAnswers = { 
          ...currentAnswers, 
          [questionId]: [...currentSelections, optionId] 
        };
      } else {
        newAnswers = { 
          ...currentAnswers, 
          [questionId]: currentSelections.filter((id: string) => id !== optionId) 
        };
      }
    } else {
      // For single-select questions
      newAnswers = { 
        ...currentAnswers, 
        [questionId]: [optionId] 
      };
    }
    
    updateObfuscatedData({ a: newAnswers });
  };

  // Reset state function
  const resetState = () => {
    // Note: we preserve the gender parameter when resetting
    const currentGender = gender;
    
    // Clear all data but keep gender
    setObfuscatedData({
      g: currentGender
    });
    
    router.push(`/quiz`);
  };

  // Set result function
  const setResult = (result: string) => {
    updateObfuscatedData({
      r: result,
      sr: 1
    });
  };

  // Function to set current question index
  const setCurrentQuestionIndex = (index: number) => {
    updateObfuscatedData({ q: index });
  };

  // Function to set gender
  const setGender = (g: string) => {
    updateObfuscatedData({ g });
  };

  return {
    currentQuestionIndex,
    answers,
    resultId,
    showResults,
    gender,
    setGender,
    setCurrentQuestionIndex,
    handleOptionSelect,
    resetState,
    setResult,
    setShowResults: (show: boolean) => updateObfuscatedData({ sr: show ? 1 : 0 }),
  };
}