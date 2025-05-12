"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import type { QuizQuestion } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import DateOfBirth from "@/components/date-of-birth"

interface QuestionCardProps {
  question: QuizQuestion
  selectedOptions: string[]
  onOptionSelect: (questionId: string, optionId: string, selected: boolean) => void
}

export default function QuestionCard({ question, selectedOptions, onOptionSelect }: QuestionCardProps) {
  const [dateOfBirth, setDateOfBirth] = useState<{ day: string; month: string; year: string }>({
    day: "",
    month: "",
    year: "",
  })
  
  // Use a ref to track if we've processed the initial DOB selection
  const initialDobProcessed = useRef(false)

  // Initialize date of birth from selectedOptions on first render
  useEffect(() => {
    if (!initialDobProcessed.current && question.id === "q2") {
      const dobOption = selectedOptions.find(option => option.startsWith('dob_'))
      if (dobOption) {
        const [_, dateString] = dobOption.split('_')
        const [year, month, day] = dateString.split('-')
        setDateOfBirth({ day, month, year })
      }
      initialDobProcessed.current = true
    }
  }, [question.id, selectedOptions])

  // Memoized handler for date of birth change to prevent recreation on each render
  const handleDateOfBirthChange = useCallback((date: { day: string; month: string; year: string }) => {
    // Only update state if values have changed
    setDateOfBirth(prev => {
      if (prev.day === date.day && prev.month === date.month && prev.year === date.year) {
        return prev;
      }
      return date;
    })
    
    // Only proceed if we have all three values
    if (date.day && date.month && date.year) {
      // Create a date string that can be used as an option ID
      const dateString = `${date.year}-${date.month}-${date.day}`
      const newOptionId = `dob_${dateString}`
      
      // Only update if the selection has changed
      const isAlreadySelected = selectedOptions.includes(newOptionId)
      if (!isAlreadySelected) {
        // First clear any existing DOB selections
        selectedOptions.forEach(optionId => {
          if (optionId.startsWith('dob_')) {
            onOptionSelect(question.id, optionId, false)
          }
        })
        
        // Then select the new one
        setTimeout(() => {
          onOptionSelect(question.id, newOptionId, true)
        }, 0)
      }
    }
  }, [question.id, selectedOptions, onOptionSelect])

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">{question.text}</h2>
        {question.subtitle && <p className="text-center text-muted-foreground">{question.subtitle}</p>}
      </div>

      <div className="space-y-3">
        {/* For the birth date question, show the DateOfBirth component */}
        {question.id === "q2" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border p-6 bg-white"
          >
            <h3 className="text-sm font-medium mb-3 text-center text-muted-foreground">
              Select your date of birth to reveal your zodiac sign
            </h3>
            <DateOfBirth 
              value={dateOfBirth}
              onChange={handleDateOfBirthChange} 
            />
          </motion.div>
        ) : (
          // For other questions, show normal options
          question.options.map((option) => {
            // Skip hidden options
            if (option.isHidden) return null;
            
            const isSelected = selectedOptions.includes(option.id)

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center rounded-lg border p-4 cursor-pointer transition-colors duration-300",
                  isSelected ? "bg-yellow-100 border-yellow-400" : "hover:bg-gray-50",
                )}
                onClick={() => onOptionSelect(question.id, option.id, !isSelected)}
                data-state={isSelected ? "selected" : "unselected"}
              >
                <div className="flex items-center flex-1 gap-3">
                  {option.icon && <div className="text-xl">{option.icon}</div>}
                  <div className="font-medium">{option.text}</div>
                </div>

                <div
                  className={cn(
                    "flex-shrink-0 rounded-full w-6 h-6 border flex items-center justify-center",
                    isSelected ? "bg-yellow-400 border-yellow-400" : "border-gray-300",
                  )}
                >
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}