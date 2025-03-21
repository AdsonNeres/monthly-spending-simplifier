
import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";

interface FinancialGoalsProps {
  totalIncome: number;
  savingsPercentage?: number;
}

const FinancialGoals: React.FC<FinancialGoalsProps> = ({
  totalIncome,
  savingsPercentage = 30,
}) => {
  const savingsAmount = totalIncome * (savingsPercentage / 100);
  const spendingLimit = totalIncome - savingsAmount;

  return (
    <div className="p-6 mb-8 space-y-6 transition-all duration-500 border border-gray-100 rounded-2xl shadow-sm bg-gradient-to-br from-white to-blue-50 animate-scale-in">
      <h2 className="text-xl font-semibold">Metas Financeiras</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 transition-all duration-300 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <p className="mb-1 text-sm font-medium text-gray-500">Renda Total:</p>
          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        
        <div className="p-4 transition-all duration-300 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <p className="mb-1 text-sm font-medium text-gray-500">
            Meta de Economia ({savingsPercentage}%):
          </p>
          <p className="text-2xl font-semibold text-expense-low">
            {formatCurrency(savingsAmount)}
          </p>
        </div>
        
        <div className="p-4 transition-all duration-300 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <p className="mb-1 text-sm font-medium text-gray-500">
            Limite para Gastos ({100 - savingsPercentage}%):
          </p>
          <p className="text-2xl font-semibold text-expense-medium">
            {formatCurrency(spendingLimit)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialGoals;
