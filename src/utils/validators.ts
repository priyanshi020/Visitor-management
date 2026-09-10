export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^[+]?[\d\s-]{7,15}$/.test(phone.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidUnit(unit: string): boolean {
  return /^[A-Za-z0-9-]{1,10}$/.test(unit.trim());
}

export function isFutureOrTodayDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  return date.getTime() >= today.getTime();
}
