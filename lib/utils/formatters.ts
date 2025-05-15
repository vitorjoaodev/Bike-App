/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param value - Valor a ser formatado
 * @returns String formatada como moeda (ex: R$ 33,33)
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Calcula o preço com desconto
 * @param originalPrice - Preço original
 * @param discountPercentage - Percentual de desconto (ex: 10 para 10%)
 * @returns Preço com desconto aplicado
 */
export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  const discount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discount;
  
  // Arredonda para 2 casas decimais para evitar problemas com números flutuantes
  return Math.round(discountedPrice * 100) / 100;
}