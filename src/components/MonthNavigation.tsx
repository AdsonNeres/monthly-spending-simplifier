
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthYear, formatMonthYear } from "@/utils/dateUtils";

interface MonthNavigationProps {
  currentMonthYear: MonthYear;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentMonthYear,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8 overflow-hidden rounded-full glassmorphism animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        className="p-2 transition-all duration-300 hover:bg-primary/10"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="sr-only">Mês anterior</span>
      </Button>
      
      <h2 className="text-lg font-medium tracking-tight capitalize">
        {formatMonthYear(currentMonthYear)}
      </h2>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="p-2 transition-all duration-300 hover:bg-primary/10"
      >
        <ChevronRight className="w-5 h-5" />
        <span className="sr-only">Próximo mês</span>
      </Button>
    </div>
  );
};

export default MonthNavigation;
