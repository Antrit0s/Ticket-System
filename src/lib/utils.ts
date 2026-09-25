export function initials(name: string) {
  return name
    .split(" ")
    .filter(function (part) { return part.length > 0; })
    .map(function (part) { return part[0]; })
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Appointment status → MUI chip color.
export function statusColor(status?: string) {
  if (status === "completed") return "success";
  if (status === "cancelled") return "default";
  return "info";
}
