/** French local numbers default to +33; international prefixes are preserved. */
export function whatsappLink(phone?: string | null): string | null {
  let number = (phone || '').trim().replace(/[\s().-]/g, '');
  if (number.startsWith('00')) number = '+' + number.slice(2);
  if (/^0[1-9]\d{8}$/.test(number)) number = '+33' + number.slice(1);
  if (!/^\+?[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number.replace(/^\+/, '')}`;
}
