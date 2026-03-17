export default function getTodayStartEndISO() {
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  return {
    start: todayStart.toISOString(),
    end: tomorrowStart.toISOString(),
  };
}
