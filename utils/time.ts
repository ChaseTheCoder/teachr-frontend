export function timeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours  === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? `${days} day ago` : `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`;
  }

  const months = Math.floor(weeks / 4);
  if (months < 12) {
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  }

  const years = Math.floor(months / 12);
  return years === 1 ? `${years} year ago` : `${years} years ago`;
}