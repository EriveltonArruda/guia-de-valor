"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const monthNames = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const fullMonthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface MonthYearPickerProps {
  currentMonth: number;
  currentYear: number;
  onChange?: (month: number, year: number) => void;
  updateUrl?: boolean;
}

export function MonthYearPicker({ currentMonth, currentYear, onChange, updateUrl }: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempYear, setTempYear] = React.useState(currentYear);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTempYear(currentYear);
    }
  }, [isOpen, currentYear]);

  const handleChange = (m: number, y: number) => {
    if (onChange) {
      onChange(m, y);
    }
    if (updateUrl) {
      router.push(`/?month=${m + 1}&year=${y}`);
    }
  };

  const handlePrev = () => {
    let m = currentMonth - 1;
    let y = currentYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    handleChange(m, y);
  };

  const handleNext = () => {
    let m = currentMonth + 1;
    let y = currentYear;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    handleChange(m, y);
  };

  const selectMonth = (m: number) => {
    handleChange(m, tempYear);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <div className="flex items-center gap-2 bg-[#292B49]/40 rounded-xl p-1.5 border border-white/10 w-fit backdrop-blur-sm">
        <button 
          onClick={handlePrev} 
          className="p-1.5 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-white uppercase tracking-wide rounded-lg hover:bg-white/5 transition"
        >
          <CalendarIcon className="h-4 w-4 text-white/60" />
          {fullMonthNames[currentMonth]} {currentYear}
        </button>

        <button 
          onClick={handleNext} 
          className="p-1.5 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-[#0b1220] border border-white/10 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3 px-2">
            <button 
              onClick={() => setTempYear(tempYear - 1)}
              className="p-1 text-white/60 hover:text-white transition rounded-md hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-white font-bold">{tempYear}</div>
            <button 
              onClick={() => setTempYear(tempYear + 1)}
              className="p-1 text-white/60 hover:text-white transition rounded-md hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((month, idx) => {
              const isActive = idx === currentMonth && tempYear === currentYear;
              return (
                <button
                  key={month}
                  onClick={() => selectMonth(idx)}
                  className={[
                    "py-2 text-xs font-semibold rounded-xl transition-colors",
                    isActive 
                      ? "bg-[#ED6936] text-black" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  ].join(" ")}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
