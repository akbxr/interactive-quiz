export interface QuizOption {
  id: string
  text: string
  icon?: string
  resultMapping?: Record<string, number>
  isHidden?: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  subtitle?: string
  multiSelect?: boolean
  minSelections?: number
  requireDateOfBirth?: boolean
  questionType?: 'standard' | 'dob' | 'zodiac'
  options: QuizOption[]
}

export interface QuizResult {
  id: string
  title: string
  subtitle?: string
  description: string
  image?: string
  recommendations?: string[]
}

export interface QuizData {
  id: string
  title: string
  description?: string
  questions: QuizQuestion[]
  results: QuizResult[]
}
