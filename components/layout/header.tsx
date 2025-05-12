import Link from "next/link"
import { Star } from "lucide-react"

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6">
      <div className="container mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-medium">nordastro</span>
        </Link>
      </div>
    </header>
  )
}
