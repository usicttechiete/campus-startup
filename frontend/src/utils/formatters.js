export const formatTrustScore = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '0%';
  }
  const percentage = Math.round(Number(value));
  return `${percentage}%`;
};

export const formatLevel = (level) => {
  if (!level) return 'Unknown';
  return level.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills.filter(Boolean);
};

export const formatName = (name) => {
  if (!name) return 'Anonymous';
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatRole = (role) => {
  if (!role) return '';
  return role
    .toString()
    .trim()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatRelativeTime = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const now = Date.now();
  const diffInSeconds = Math.round((now - date.getTime()) / 1000);

  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.round(diffInDays / 7);
  if (diffInWeeks < 5) return `${diffInWeeks}w ago`;

  const diffInMonths = Math.round(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.round(diffInDays / 365);
  return `${diffInYears}y ago`;
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');
};
