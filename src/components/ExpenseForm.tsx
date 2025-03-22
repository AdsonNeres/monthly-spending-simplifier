
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { formatCurrency, parseCurrencyInput } from "@/utils/formatCurrency";
import { toast } from "sonner";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error("A descrição é obrigatória");
      return;
    }
    
    if (!amount.trim()) {
      toast.error("O valor é obrigatório");
      return;
    }
    
    const parsedAmount = parseCurrencyInput(amount);
    
    if (parsedAmount <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newExpense: Expense = {
        id: Date.now().toString(),
        description: description.trim(),
        amount: parsedAmount,
        date: new Date(),
      };
      
      onAddExpense(newExpense);
      
      // Reset form
      setDescription("");
      setAmount("");
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error);
      toast.error("Não foi possível adicionar o gasto. Tente novamente.");
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  // Handle input for currency formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, comma and dot
    const value = e.target.value.replace(/[^\d,.]/g, "");
    setAmount(value);
  };

  return (
    <div className="p-6 mb-8 transition-all duration-500 bg-white border border-gray-100 rounded-2xl shadow-sm animate-scale-in">
      <h2 className="mb-4 text-xl font-semibold">Adicionar Gasto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expense-description" className="text-sm font-medium">
            Descrição do gasto
          </Label>
          <Input
            id="expense-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Supermercado, Aluguel, Netflix..."
            className="input-focus-effect"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expense-amount" className="text-sm font-medium">
            Valor (R$)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <Input
              id="expense-amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0,00"
              className="pl-10 input-focus-effect"
              required
              inputMode="decimal"
            />
          </div>
        </div>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </form>
    </div>
  );
};

export default ExpenseForm;
