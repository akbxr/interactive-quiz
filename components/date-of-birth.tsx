"use client"

import React, { useCallback, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select"

interface DateOfBirthProps {
  onChange: (date: { day: string; month: string; year: string }) => void
  value?: { day: string; month: string; year: string }
}

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

export default function DateOfBirth({ onChange, value = { day: "", month: "", year: "" } }: DateOfBirthProps) {
  // Use controlled state with initial values from props
  const [day, setDay] = useState(value.day || "")
  const [month, setMonth] = useState(value.month || "")
  const [year, setYear] = useState(value.year || "")
  const [zodiacSign, setZodiacSign] = useState<{name: string; symbol: string; dates: string; element?: string; traits?: string[]} | null>(null)
  
  // Precompute these arrays only once
  const months = useMemo(() => [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ], [])
  
  const currentYear = new Date().getFullYear()
  const years = useMemo(() => Array.from(
    { length: 100 }, 
    (_, i) => (currentYear - i).toString()
  ), [currentYear])

  // Function to check if a date is valid
  const isValidDate = useCallback((day: string, month: string, year: string): boolean => {
    if (!day || !month || !year) return false;
    
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    
    // Check if the numbers are valid
    if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
    
    // Check month range
    if (m < 1 || m > 12) return false;
    
    // Get last day of month
    const lastDay = new Date(y, m, 0).getDate();
    
    // Check day range
    if (d < 1 || d > lastDay) return false;
    
    return true;
  }, [])

  // Calculate available days based on selected month and year
  const availableDays = useMemo(() => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
    
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, [month, year])

  // Handle day change with validation
  const handleDayChange = useCallback((newDay: string) => {
    setDay(newDay);
    if (newDay && month && year && isValidDate(newDay, month, year)) {
      // Update zodiac sign
      setZodiacSign(getZodiacSign(parseInt(newDay), parseInt(month)));
      onChange({ day: newDay, month, year });
    }
  }, [month, year, onChange, isValidDate]);

  // Handle month change with validation
  const handleMonthChange = useCallback((newMonth: string) => {
    setMonth(newMonth);
    
    // If the current day is invalid for the new month, reset it
    const newDaysInMonth = new Date(parseInt(year || new Date().getFullYear().toString()), parseInt(newMonth), 0).getDate();
    const currentDay = parseInt(day, 10);
    
    if (currentDay > newDaysInMonth) {
      // Day is invalid for new month, reset it
      setDay("");
      setZodiacSign(null);
      if (year && isValidDate("01", newMonth, year)) {
        onChange({ day: "", month: newMonth, year });
      }
    } else if (day && year && isValidDate(day, newMonth, year)) {
      // Update zodiac sign
      setZodiacSign(getZodiacSign(parseInt(day), parseInt(newMonth)));
      onChange({ day, month: newMonth, year });
    }
  }, [day, year, onChange, isValidDate]);

  // Handle year change with validation
  const handleYearChange = useCallback((newYear: string) => {
    setYear(newYear);
    
    // Leap year validation for February
    if (month === "02") {
      const newDaysInMonth = new Date(parseInt(newYear), 2, 0).getDate();
      const currentDay = parseInt(day, 10);
      
      if (currentDay > newDaysInMonth) {
        setDay("");
        if (isValidDate("01", month, newYear)) {
          onChange({ day: "", month, year: newYear });
        }
      } else if (day && isValidDate(day, month, newYear)) {
        onChange({ day, month, year: newYear });
      }
    } else if (day && month && isValidDate(day, month, newYear)) {
      onChange({ day, month, year: newYear });
    }
  }, [day, month, onChange, isValidDate]);

  // Update local state if props change externally
  React.useEffect(() => {
    if (value && (value.day !== day || value.month !== month || value.year !== year)) {
      if (value.day) setDay(value.day);
      if (value.month) setMonth(value.month);
      if (value.year) setYear(value.year);
      
      // Update zodiac sign when props change
      if (value.day && value.month) {
        setZodiacSign(getZodiacSign(parseInt(value.day), parseInt(value.month)));
      }
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Select value={month} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={day} onValueChange={handleDayChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {availableDays.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={year} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {zodiacSign && (
          <motion.div 
            key={zodiacSign.name}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
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
        )}
      </AnimatePresence>
    </div>
  )
}