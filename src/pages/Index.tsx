
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import MonthNavigation from "@/components/MonthNavigation";
import IncomeSection from "@/components/IncomeSection";
import FinancialGoals from "@/components/FinancialGoals";
import ExpenseForm, { Expense } from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import {
  MonthYear,
  getCurrentMonthYear,
  getNextMonth,
  getPreviousMonth,
  formatMonthYear,
} from "@/utils/dateUtils";

const Index = () => {
  const [currentMonthYear, setCurrentMonthYear] = useState<MonthYear>(getCurrentMonthYear());
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Unique key for localStorage based on month and year
  const getStorageKey = (prefix: string) => `finance_tracker_${prefix}_${currentMonthYear.month}_${currentMonthYear.year}`;

  // Load data from localStorage when month changes
  useEffect(() => {
    const savedIncome = localStorage.getItem(getStorageKey("income"));
    const savedExpenses = localStorage.getItem(getStorageKey("expenses"));

    if (savedIncome) {
      setIncome(JSON.parse(savedIncome));
    } else {
      setIncome(0);
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      setExpenses([]);
    }
  }, [currentMonthYear]);

  // Save income to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(getStorageKey("income"), JSON.stringify(income));
  }, [income, currentMonthYear]);

  // Save expenses to localStorage when they change
  useEffect(() => {
    localStorage.setItem(getStorageKey("expenses"), JSON.stringify(expenses));
  }, [expenses, currentMonthYear]);

  const handlePreviousMonth = () => {
    setCurrentMonthYear(getPreviousMonth(currentMonthYear));
  };

  const handleNextMonth = () => {
    setCurrentMonthYear(getNextMonth(currentMonthYear));
  };

  const handleIncomeChange = (newIncome: number) => {
    setIncome(newIncome);
    toast.success("Renda atualizada com sucesso!");
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
    toast.success("Gasto adicionado com sucesso!");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast.success("Gasto removido com sucesso!");
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container px-4 mx-auto max-w-5xl">
        <header className="mb-12 text-center animate-fade-in">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
            Controle de Gastos Mensais
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie suas finanças pessoais com simplicidade e elegância
          </p>
        </header>

        <MonthNavigation
          currentMonthYear={currentMonthYear}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <IncomeSection onIncomeChange={handleIncomeChange} />
            <FinancialGoals totalIncome={income} savingsPercentage={30} />
          </div>

          <div className="space-y-6">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              currentMonthYearStr={formatMonthYear(currentMonthYear)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
