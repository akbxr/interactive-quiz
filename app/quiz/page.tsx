import Quiz from "@/components/quiz"
import { quizData } from "@/lib/quiz-data"
import { extractUrlParameters } from "@/lib/utils"

export default function QuizPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract data from the URL
  let gender: string | undefined = undefined;
  
  // Handle different URL formats
  if (searchParams.d) {
    const dParam = searchParams.d;
    // Check if d is a simple gender string (simple format from homepage)
    if (typeof dParam === 'string' && ['male', 'female', 'other'].includes(dParam)) {
      gender = dParam;
    }
    // Otherwise it's the obfuscated data parameter, the Quiz component will handle it
  } else {
    // Legacy gender parameter handling for backward compatibility
    gender = typeof searchParams.gender === 'string' ? searchParams.gender : undefined;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Quiz quizData={quizData} initialGender={gender} />
    </main>
  )
}