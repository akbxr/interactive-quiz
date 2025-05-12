"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { QuizData, QuizResult } from "@/lib/types"
import QuestionCard from "@/components/question-card"
import ResultsScreen from "@/components/results-screen"
import { useQuizState } from "@/hooks/use-quiz-state"

// Helper function to determine zodiac sign from day and month
function getZodiacSign(day: number, month: number): {
  name: string;
  symbol: string;
  dates: string;
  element?: string;
  traits?: string[];
} | null {
  if (!day || !month) return null;
  
  const zodiacSigns: Array<{
    name: string;
    symbol: string;
    dates: string;
    element: string;
    traits: string[];
  }> = [
    { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", traits: ["Ambitious", "Responsible", "Practical"] },
    { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", traits: ["Independent", "Original", "Humanitarian"] },
    { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", traits: ["Compassionate", "Intuitive", "Imaginative"] },
    { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", traits: ["Courageous", "Determined", "Confident"] },
    { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", traits: ["Reliable", "Patient", "Practical"] },
    { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", traits: ["Adaptable", "Curious", "Communicative"] },
    { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", traits: ["Intuitive", "Emotional", "Protective"] },
    { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", traits: ["Creative", "Passionate", "Generous"] },
    { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", traits: ["Analytical", "Practical", "Meticulous"] },
    { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", traits: ["Diplomatic", "Fair-minded", "Social"] },
    { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", traits: ["Passionate", "Determined", "Intuitive"] },
    { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", traits: ["Generous", "Idealistic", "Humorous"] }
  ];
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[1]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns[2]; // Pisces
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[3]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[4]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[5]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[6]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[7]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[8]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[9]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[10]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[11]; // Sagittarius
  return zodiacSigns[0]; // Capricorn
}

interface QuizProps {
  quizData: QuizData
  initialGender?: string
}

export default function Quiz({ quizData, initialGender }: QuizProps) {
  const {
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
    setShowResults,
  } = useQuizState(quizData.id)
  
  const [progress, setProgress] = useState(0)
  const [result, setResultData] = useState<QuizResult | null>(null)
  const [zodiacData, setZodiacData] = useState<{name: string; symbol: string; dates: string; element?: string; traits?: string[]} | null>(null)

  const currentQuestion = quizData.questions[currentQuestionIndex]

  // Set the gender from props when component mounts if it's not already set
  useEffect(() => {
    if (initialGender && !gender) {
      setGender(initialGender)
    }
  }, [initialGender, gender, setGender])

  // Set the current result data whenever resultId changes
  useEffect(() => {
    if (resultId) {
      const foundResult = quizData.results.find((r) => r.id === resultId)
      if (foundResult) {
        setResultData(foundResult)
      }
    } else {
      setResultData(null)
    }
  }, [resultId, quizData.results])

  // Calculate zodiac sign when date of birth is entered 
  useEffect(() => {
    if (answers["q2"]) {
      const dobOption = answers["q2"].find((option: string) => option.startsWith('dob_'))
      if (dobOption) {
        const [_, dateString] = dobOption.split('_')
        const [year, month, day] = dateString.split('-')
        const zodiacSign = getZodiacSign(parseInt(day), parseInt(month))
        setZodiacData(zodiacSign)
      }
    }
  }, [answers]);

  useEffect(() => {
    // Calculate progress percentage
    setProgress(((currentQuestionIndex + 1) / quizData.questions.length) * 100)
  }, [currentQuestionIndex, quizData.questions.length])

  const handleOptionSelectWrapped = (questionId: string, optionId: string, selected: boolean) => {
    const question = quizData.questions.find(q => q.id === questionId)
    handleOptionSelect(questionId, optionId, selected, question?.multiSelect ?? false)
  }

  const handleContinue = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      // If current question is date of birth, automatically select an option for the zodiac question
      if (currentQuestion.id === "q2" && quizData.questions[currentQuestionIndex + 1].questionType === "zodiac") {
        // For zodiac question, we'll auto-select the continue option
        const zodiacQuestion = quizData.questions[currentQuestionIndex + 1]
        const continueOption = zodiacQuestion.options[0]
        handleOptionSelect(zodiacQuestion.id, continueOption.id, true, false)
      }
      
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate results
      const result = calculateResult(answers, quizData)
      setResultData(result)
      setResult(result.id)
    }
  }

  const calculateResult = (answers: Record<string, string[]>, quizData: QuizData): QuizResult => {
    // This is a simple implementation - you can make this more sophisticated
    const resultScores = quizData.results.map((result) => {
      let score = 0

      // Loop through all answers
      Object.entries(answers).forEach(([questionId, selectedOptionIds]) => {
        const question = quizData.questions.find((q) => q.id === questionId)
        if (!question) return

        // Check if any selected option maps to this result
        selectedOptionIds.forEach((optionId) => {
          // Handle normal options
          if (!optionId.startsWith('dob_')) {
            const option = question.options.find((o) => o.id === optionId)
            if (option && option.resultMapping && option.resultMapping[result.id]) {
              score += option.resultMapping[result.id]
            }
          } 
          // Handle date of birth option
          else {
            // Extract date from dob_YYYY-MM-DD format
            const [_, dateString] = optionId.split('_')
            const [year, month] = dateString.split('-')
            
            // Apply result mapping based on the month
            const monthNum = parseInt(month, 10)
            if (monthNum >= 1 && monthNum <= 3) {
              // January-March
              if (result.id === 'aries') score += 3
              else if (['capricorn', 'aquarius', 'pisces'].includes(result.id)) score += 2
            } else if (monthNum >= 4 && monthNum <= 6) {
              // April-June
              if (['taurus', 'gemini'].includes(result.id)) score += 3
              else if (result.id === 'cancer') score += 2
            } else if (monthNum >= 7 && monthNum <= 9) {
              // July-September
              if (['leo', 'virgo'].includes(result.id)) score += 3
              else if (['cancer', 'libra'].includes(result.id)) score += 1
            } else if (monthNum >= 10 && monthNum <= 12) {
              // October-December
              if (['scorpio', 'sagittarius'].includes(result.id)) score += 3
              else if (['libra', 'capricorn'].includes(result.id)) score += 2
            }
          }
        })
      })

      // Give additional score based on gender selection if relevant
      if (gender && result.id.includes(gender)) {
        score += 1; // Small bonus for gender relevance
      }

      return { resultId: result.id, score }
    })

    // Find the result with the highest score
    const highestScore = resultScores.reduce(
      (prev, current) => (current.score > prev.score ? current : prev),
      resultScores[0],
    )

    return quizData.results.find((r) => r.id === highestScore.resultId) || quizData.results[0]
  }

  const canContinue = () => {
    if (!currentQuestion) return false

    // For zodiac question, always allow continue
    if (currentQuestion.questionType === "zodiac") {
      return true;
    }

    const currentAnswers = answers[currentQuestion.id] || []

    // Date of birth question special case
    if (currentQuestion.id === "q2") {
      // Check if there's a date of birth answer (they start with dob_)
      return currentAnswers.some((answer: string) => answer.startsWith('dob_'))
    }
    
    if (currentQuestion.multiSelect) {
      // For multi-select, check if minimum selections are met
      return currentQuestion.minSelections
        ? currentAnswers.length >= currentQuestion.minSelections
        : currentAnswers.length > 0
    } else {
      // For single-select, just need one answer
      return currentAnswers.length > 0
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!showResults ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {quizData.questions.length}
            </div>
            <div className="text-sm font-medium">
              {quizData.title} {gender ? `| ${gender.charAt(0).toUpperCase() + gender.slice(1)}` : ''}
            </div>
          </div>

          <Progress value={progress} className="h-1" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                selectedOptions={answers[currentQuestion.id] || []}
                onOptionSelect={handleOptionSelectWrapped}
                zodiacData={zodiacData}
              />
            </motion.div>
          </AnimatePresence>

          <Button
            className="w-full py-6 text-base rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
            disabled={!canContinue()}
            onClick={handleContinue}
          >
            {currentQuestion.questionType === "zodiac" ? "Lanjutkan" : "Continue"}
          </Button>
        </div>
      ) : (
        <ResultsScreen result={result} />
      )}
    </div>
  )
}