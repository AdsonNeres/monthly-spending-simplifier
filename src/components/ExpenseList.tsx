
import React from "react";
import { Expense } from "./ExpenseForm";
import { formatCurrency } from "@/utils/formatCurrency";
import { Trash2 } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  currentMonthYearStr: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  currentMonthYearStr,
}) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Function to determine expense category based on amount
  const getExpenseCategory = (amount: number) => {
    if (amount < 100) return "low";
    if (amount < 500) return "medium";
    return "high";
  };

  if (expenses.length === 0) {
    return (
      <div className="p-6 mb-8 space-y-4 bg-white border border-gray-100 rounded-2xl shadow-sm animate-fade-in">
        <h2 className="text-xl font-semibold">Análise de Gastos</h2>
        <div className="flex flex-col items-center justify-center py-8 space-y-2 text-center">
          <div className="p-6 mb-2 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-gray-400"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
              <path d="M9 14h6"></path>
            </svg>
          </div>
          <p className="text-gray-500">
            Nenhum gasto registrado para {currentMonthYearStr}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8 space-y-4 transition-all duration-500 bg-white border border-gray-100 rounded-2xl shadow-sm animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Análise de Gastos</h2>
        <p className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-full">
          Total: {formatCurrency(totalExpenses)}
        </p>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className={`expense-card ${getExpenseCategory(expense.amount)} p-4 pl-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">{expense.description}</h3>
                <p className="text-lg font-semibold">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="p-2 text-gray-400 transition-all duration-300 rounded-full hover:bg-red-50 hover:text-red-500"
                aria-label="Delete expense"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
