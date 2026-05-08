export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const classNames = (...classes: Array<string | boolean | null | undefined>) =>
  classes.filter(Boolean).join(" ");
