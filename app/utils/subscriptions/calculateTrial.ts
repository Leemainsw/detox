export default function calculateTrial(createdAt: string, trialMonths: number) {
  const today = new Date();
  const createdAtDate = new Date(createdAt);
  const diffTime = Math.abs(today.getTime() - createdAtDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= trialMonths;
}
