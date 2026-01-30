const MAX_PHONE_DIGITS = 15;
const MIN_PHONE_DIGITS = 10;

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const limited = digits.slice(0, MAX_PHONE_DIGITS);

  if (limited.length === 0) return '';
  if (limited.length <= 1) return `+${limited}`;
  if (limited.length <= 4) return `+${limited.slice(0, 1)} (${limited.slice(1)}`;
  if (limited.length <= 7) return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4)}`;
  if (limited.length <= 9) return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
  return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}-${limited.slice(9)}`;
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= MIN_PHONE_DIGITS;
}
