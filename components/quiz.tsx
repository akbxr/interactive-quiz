"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { QuizData, QuizResult } from "@/lib/types"
import QuestionCard from "@/components/question-card"
import ResultsScreen from "@/components/results-screen"
import { useQuizState } from "@/hooks/use-quiz-state"

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
              />
            </motion.div>
          </AnimatePresence>

          <Button
            className="w-full py-6 text-base rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
            disabled={!canContinue()}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      ) : (
        <ResultsScreen result={result} />
      )}
    </div>
  )
}