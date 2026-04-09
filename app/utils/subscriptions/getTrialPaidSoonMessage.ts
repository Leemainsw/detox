/**
 * @description 결제일 당일(0)은 내일 유료 시작 안내, 그 전에는 N일 뒤 형태
 * @param daysUntilPayment - 남은 일수
 * @returns 메시지
 */
export default function getTrialPaidSoonMessage(
  daysUntilPayment: number
): string {
  if (daysUntilPayment <= 1) {
    return "내일부터는 유료결제 될 예정이에요";
  }
  return `${daysUntilPayment}일 뒤에 유료결제 될 예정이에요`;
}
