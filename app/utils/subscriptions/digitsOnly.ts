export default function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}
