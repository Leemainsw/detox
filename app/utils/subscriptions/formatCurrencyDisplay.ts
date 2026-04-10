/** 정수 금액 천 단위 콤마 (ko-KR) */
export default function formatCurrencyDisplay(digits: string): string {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
