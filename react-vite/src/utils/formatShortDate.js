export function formatShortDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.toLocaleString("en-us", { month: "short" });
  const year = date.getUTCFullYear();
  return `${month} ${year}`;
}