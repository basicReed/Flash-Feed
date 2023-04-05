export function timeSince(timestamp) {
  const now = new Date();
  const localTimestamp = new Date(timestamp).toLocaleString();
  const seconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (seconds < 180) {
    return "Just now";
  }

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [interval, secondsPerInterval] of Object.entries(intervals)) {
    const count = Math.floor(seconds / secondsPerInterval);
    if (count > 0) {
      return `${count} ${interval}${count > 1 ? "s" : ""} ago`;
    }
  }

  return `on ${localTimestamp}`;
}
