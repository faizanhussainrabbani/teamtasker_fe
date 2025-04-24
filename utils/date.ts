/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Format a date to a human-readable string
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param format - Optional format (defaults to localized date)
 * @returns Formatted date string
 * 
 * @example
 * // Returns "Jan 1, 2023"
 * formatDate("2023-01-01T00:00:00Z")
 * 
 * @example
 * // Returns "01/01/2023"
 * formatDate("2023-01-01T00:00:00Z", "numeric")
 */
export function formatDate(
  date: Date | string,
  format: 'long' | 'short' | 'numeric' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'short':
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    
    case 'numeric':
      return dateObj.toLocaleDateString();
    
    case 'relative':
      return getRelativeTimeString(dateObj);
    
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Format a date to a time string
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string
 * 
 * @example
 * // Returns "3:30 PM"
 * formatTime("2023-01-01T15:30:00Z")
 */
export function formatTime(
  date: Date | string,
  includeSeconds = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true,
  });
}

/**
 * Get a relative time string (e.g., "2 hours ago", "in 3 days")
 * 
 * @param date - Date to compare against now
 * @returns Relative time string
 * 
 * @example
 * // Returns "2 hours ago" (if date was 2 hours ago)
 * getRelativeTimeString(twoHoursAgo)
 */
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);
  
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  
  if (Math.abs(diffInSecs) < 60) {
    return rtf.format(diffInSecs, 'second');
  }
  
  if (Math.abs(diffInMins) < 60) {
    return rtf.format(diffInMins, 'minute');
  }
  
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }
  
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  }
  
  // Fall back to formatted date for older dates
  return formatDate(date, 'short');
}

/**
 * Check if a date is today
 * 
 * @param date - Date to check
 * @returns True if the date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Add days to a date
 * 
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
