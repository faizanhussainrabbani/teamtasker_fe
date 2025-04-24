/**
 * String utility functions for formatting and manipulation
 */

/**
 * Capitalize the first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * // Returns "Hello"
 * capitalize("hello")
 */
export function capitalize(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a maximum length and add ellipsis
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - String to append when truncated (default: "...")
 * @returns Truncated string
 * 
 * @example
 * // Returns "This is a lo..."
 * truncate("This is a long string", 10)
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis = '...'
): string {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  
  return str.slice(0, maxLength) + ellipsis;
}

/**
 * Convert a string to camelCase
 * 
 * @param str - String to convert
 * @returns camelCase string
 * 
 * @example
 * // Returns "helloWorld"
 * toCamelCase("hello_world")
 * 
 * @example
 * // Returns "helloWorld"
 * toCamelCase("hello-world")
 */
export function toCamelCase(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/**
 * Convert a string to kebab-case
 * 
 * @param str - String to convert
 * @returns kebab-case string
 * 
 * @example
 * // Returns "hello-world"
 * toKebabCase("helloWorld")
 */
export function toKebabCase(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert a string to snake_case
 * 
 * @param str - String to convert
 * @returns snake_case string
 * 
 * @example
 * // Returns "hello_world"
 * toSnakeCase("helloWorld")
 */
export function toSnakeCase(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Format a name to initials
 * 
 * @param name - Full name to convert to initials
 * @param maxInitials - Maximum number of initials to return
 * @returns Initials string
 * 
 * @example
 * // Returns "JD"
 * getInitials("John Doe")
 */
export function getInitials(name: string, maxInitials = 2): string {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('');
}

/**
 * Slugify a string (convert to URL-friendly format)
 * 
 * @param str - String to slugify
 * @returns URL-friendly slug
 * 
 * @example
 * // Returns "hello-world"
 * slugify("Hello World!")
 */
export function slugify(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
