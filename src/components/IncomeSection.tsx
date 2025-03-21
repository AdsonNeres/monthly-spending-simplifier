
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Save } from "lucide-react";
import { formatCurrency, parseCurrencyInput } from "@/utils/formatCurrency";

interface IncomeSectionProps {
  onIncomeChange: (income: number) => void;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({ onIncomeChange }) => {
  const [mainIncome, setMainIncome] = useState<string>("");
  const [showAdditionalIncome, setShowAdditionalIncome] = useState<boolean>(false);
  const [additionalIncome, setAdditionalIncome] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    const mainAmount = parseCurrencyInput(mainIncome);
    const additionalAmount = showAdditionalIncome ? parseCurrencyInput(additionalIncome) : 0;
    const totalIncome = mainAmount + additionalAmount;
    
    onIncomeChange(totalIncome);
    setSaved(true);
    
    // Clear the input values after saving
    setMainIncome("");
    if (showAdditionalIncome) {
      setAdditionalIncome("");
    }
    
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 mb-8 space-y-4 transition-all duration-500 bg-white border border-gray-100 rounded-2xl shadow-sm animate-scale-in">
      <h2 className="text-xl font-semibold">Renda Mensal</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="main-income" className="text-sm font-medium">
            Salário Mensal (R$)
          </Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <Input
                id="main-income"
                type="text"
                placeholder="0,00"
                value={mainIncome}
                onChange={(e) => {
                  setMainIncome(e.target.value);
                  setSaved(false);
                }}
                className="pl-10 input-focus-effect"
              />
            </div>
            <Button 
              onClick={handleSave}
              className="transition-all duration-300 bg-primary hover:bg-primary/90"
            >
              {saved ? (
                <span className="flex items-center gap-1">
                  Salvo
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  Salvar
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {!showAdditionalIncome ? (
          <Button
            variant="ghost"
            onClick={() => setShowAdditionalIncome(true)}
            className="flex items-center w-full gap-1 text-sm text-gray-600 transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" />
            Existe outra renda?
          </Button>
        ) : (
          <div className="space-y-2 animate-slide-down">
            <div className="flex items-center justify-between">
              <Label htmlFor="additional-income" className="text-sm font-medium">
                Renda Adicional (R$)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAdditionalIncome(false);
                  setAdditionalIncome("");
                  setSaved(false);
                }}
                className="h-6 px-2 text-xs text-gray-500"
              >
                <MinusCircle className="w-3 h-3 mr-1" />
                Remover
              </Button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <Input
                id="additional-income"
                type="text"
                placeholder="0,00"
                value={additionalIncome}
                onChange={(e) => {
                  setAdditionalIncome(e.target.value);
                  setSaved(false);
                }}
                className="pl-10 input-focus-effect"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeSection;
