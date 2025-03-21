
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const parseCurrencyInput = (value: string): number => {
  if (!value) return 0;
  
  // Remove R$, spaces, and non-number characters except for comma and dot
  const cleaned = value.replace(/[^\d,.]/g, "");
  
  // Replace comma with dot for calculation
  const normalized = cleaned.replace(",", ".");
  
  // Parse to float
  const amount = parseFloat(normalized);
  
  // Return 0 if not a valid number
  return isNaN(amount) ? 0 : amount;
};
