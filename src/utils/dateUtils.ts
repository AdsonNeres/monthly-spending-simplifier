
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export type MonthYear = {
  month: number;
  year: number;
  date: Date;
};

export const getCurrentMonthYear = (): MonthYear => {
  const today = new Date();
  return {
    month: getMonth(today),
    year: getYear(today),
    date: today,
  };
};

export const getNextMonth = (current: MonthYear): MonthYear => {
  const nextMonthDate = addMonths(current.date, 1);
  return {
    month: getMonth(nextMonthDate),
    year: getYear(nextMonthDate),
    date: nextMonthDate,
  };
};

export const getPreviousMonth = (current: MonthYear): MonthYear => {
  const prevMonthDate = subMonths(current.date, 1);
  return {
    month: getMonth(prevMonthDate),
    year: getYear(prevMonthDate),
    date: prevMonthDate,
  };
};

export const formatMonthYear = (monthYear: MonthYear): string => {
  return format(monthYear.date, "MMMM yyyy", { locale: ptBR });
};

export const formatMonthYearShort = (monthYear: MonthYear): string => {
  return format(monthYear.date, "MMM yyyy", { locale: ptBR });
};
