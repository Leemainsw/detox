export default function getTodayStartEndISO() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  return {
    start: todayStart.toISOString(),
    end: tomorrowStart.toISOString(),
  };
}
