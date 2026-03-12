import { addMonths, isBefore, isEqual } from "date-fns";

export default function calculateTrial(createdAt: string, trialMonths: number) {
  const today = new Date();
  const createdAtDate = new Date(createdAt);
  const trialEndDate = addMonths(createdAtDate, trialMonths);
  return isBefore(today, trialEndDate) || isEqual(today, trialEndDate);
}
