"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MonthSelector({ currentMonth, currentYear }: { currentMonth: number, currentYear: number }) {
  const router = useRouter();

  const handlePrev = () => {
    let m = currentMonth - 1;
    let y = currentYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    router.push(`/?month=${m + 1}&year=${y}`);
  };

  const handleNext = () => {
    let m = currentMonth + 1;
    let y = currentYear;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    router.push(`/?month=${m + 1}&year=${y}`);
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const label = `${monthNames[currentMonth]} ${currentYear}`;

  return (
    <div className="flex items-center gap-4 bg-[#292B49]/40 rounded-xl p-1.5 border border-white/10 w-fit backdrop-blur-sm">
      <button 
        onClick={handlePrev} 
        className="p-1.5 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="text-sm font-bold text-white min-w-[120px] text-center uppercase tracking-wide">
        {label}
      </div>
      <button 
        onClick={handleNext} 
        className="p-1.5 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
