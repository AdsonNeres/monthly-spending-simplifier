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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [currentMonthYear, setCurrentMonthYear] = useState<MonthYear>(getCurrentMonthYear());
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Carregar dados do Supabase quando o mês mudar ou ao iniciar
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Carregar renda mensal
        const { data: incomeData, error: incomeError } = await supabase
          .from('monthly_income')
          .select('amount')
          .eq('user_id', user.id)
          .eq('month', currentMonthYear.month + 1) // +1 porque os meses no JS são 0-indexed
          .eq('year', currentMonthYear.year)
          .maybeSingle(); // Changed from single() to maybeSingle()
        
        if (incomeError) {
          console.error("Erro ao carregar renda:", incomeError);
          toast.error("Erro ao carregar dados de renda");
        } else if (incomeData) {
          setIncome(incomeData.amount);
        } else {
          setIncome(0);
        }
        
        // Carregar despesas
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .eq('month', currentMonthYear.month + 1)
          .eq('year', currentMonthYear.year);
        
        if (expensesError) {
          console.error("Erro ao carregar despesas:", expensesError);
          toast.error("Erro ao carregar dados de despesas");
        } else if (expensesData) {
          const formattedExpenses: Expense[] = expensesData.map(exp => ({
            id: exp.id,
            description: exp.description,
            amount: exp.amount,
            date: new Date(exp.created_at)
          }));
          
          setExpenses(formattedExpenses);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentMonthYear, user]);

  const handlePreviousMonth = () => {
    setCurrentMonthYear(getPreviousMonth(currentMonthYear));
  };

  const handleNextMonth = () => {
    setCurrentMonthYear(getNextMonth(currentMonthYear));
  };

  const handleIncomeChange = async (newIncome: number) => {
    if (!user) return;
    
    try {
      // Verificar se já existe um registro para este mês
      const { data: existingIncome, error: checkError } = await supabase
        .from('monthly_income')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', currentMonthYear.month + 1)
        .eq('year', currentMonthYear.year)
        .maybeSingle(); // Changed from single() to maybeSingle()
      
      if (checkError) {
        console.error("Erro ao verificar renda:", checkError);
        throw checkError;
      }
      
      if (existingIncome) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('monthly_income')
          .update({ amount: newIncome, updated_at: new Date().toISOString() })
          .eq('id', existingIncome.id);
        
        if (error) throw error;
      } else {
        // Inserir novo registro
        const { error } = await supabase
          .from('monthly_income')
          .insert({
            user_id: user.id,
            amount: newIncome,
            month: currentMonthYear.month + 1,
            year: currentMonthYear.year
          });
        
        if (error) throw error;
      }
      
      setIncome(newIncome);
      toast.success("Renda atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar renda:", error);
      toast.error("Erro ao salvar renda");
    }
  };

  const handleAddExpense = async (expense: Expense) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          id: expense.id,
          user_id: user.id,
          description: expense.description,
          amount: expense.amount,
          month: currentMonthYear.month + 1, // +1 because months are 0-indexed in JS
          year: currentMonthYear.year,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error("Erro detalhado:", error);
        throw error;
      }
      
      const newExpense = { ...expense, id: expense.id };
      setExpenses([...expenses, newExpense]);
      toast.success("Gasto adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error);
      toast.error("Erro ao adicionar gasto");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setExpenses(expenses.filter((expense) => expense.id !== id));
      toast.success("Gasto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover gasto:", error);
      toast.error("Erro ao remover gasto");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Carregando seus dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container px-4 mx-auto max-w-5xl">
        <header className="mb-8 md:mb-12 flex justify-between items-center">
          <div className="text-center animate-fade-in">
            <h1 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Controle de Gastos Mensais
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Gerencie suas finanças pessoais com simplicidade e elegância
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </header>

        <MonthNavigation
          currentMonthYear={currentMonthYear}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <IncomeSection 
              onIncomeChange={handleIncomeChange} 
              initialIncome={income}
            />
            <FinancialGoals 
              totalIncome={income} 
              totalExpenses={totalExpenses}
              savingsPercentage={30} 
            />
          </div>

          <div className="space-y-6">
            <ExpenseForm 
              onAddExpense={handleAddExpense}
              currentMonthYear={currentMonthYear}
            />
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
