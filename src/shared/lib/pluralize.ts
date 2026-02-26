/**
 * Russian pluralization
 * pluralize(1, ['счёт', 'счёта', 'счётов']) => 'счёт'
 * pluralize(3, ['счёт', 'счёта', 'счётов']) => 'счёта'
 * pluralize(5, ['счёт', 'счёта', 'счётов']) => 'счётов'
 */
export function pluralize(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (mod100 >= 11 && mod100 <= 19) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}
