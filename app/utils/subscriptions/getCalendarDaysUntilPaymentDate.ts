import { parse, startOfDay } from "date-fns";
import { differenceInCalendarDays } from "date-fns";

/**
 * @description 결제 예정일과 동일한 ISO 날짜(yyyy-MM-dd)까지 달력 기준 남은 일수.
 * @param isoDate - 결제 예정일
 * @returns 남은 일수
 */
export default function getCalendarDaysUntilPaymentDate(
  isoDate: string | null
): number | null {
  if (!isoDate?.trim()) return null;
  const dayOnly = isoDate.split("T")[0];
  const target = startOfDay(parse(dayOnly, "yyyy-MM-dd", new Date()));
  return differenceInCalendarDays(target, startOfDay(new Date()));
}
