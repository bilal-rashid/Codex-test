export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

export const todayString = (): string => new Date().toISOString().slice(0, 10);
