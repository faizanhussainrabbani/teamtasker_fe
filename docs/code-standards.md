# TeamTasker Code Documentation Standards

## Component Documentation

All components should include JSDoc comments with the following information:

```tsx
/**
 * @component ComponentName
 * @description Brief description of what the component does and its purpose
 *
 * @example
 * // Basic usage
 * <ComponentName prop1="value" prop2={value} />
 *
 * // With optional props
 * <ComponentName 
 *   prop1="value"
 *   optionalProp="value"
 * />
 */
```

## Props Documentation

Document props using TypeScript interfaces with JSDoc comments:

```tsx
/**
 * Props for the ComponentName component
 */
interface ComponentNameProps {
  /**
   * Description of what this prop does
   * @default defaultValue (if applicable)
   */
  propName: PropType;
  
  /**
   * Description of optional prop
   */
  optionalProp?: OptionalPropType;
}
```

## Function Documentation

Document functions and hooks with JSDoc:

```tsx
/**
 * Description of what the function does
 * 
 * @param paramName - Description of the parameter
 * @returns Description of the return value
 * 
 * @example
 * // Example usage
 * const result = functionName(paramValue);
 */
function functionName(paramName: ParamType): ReturnType {
  // Implementation
}
```

## Type Definitions

Place shared types in dedicated files with clear documentation:

```tsx
/**
 * Represents a user in the system
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * User's full name
   */
  name: string;
  
  // Other properties...
}
```

## File Organization

- Group related constants in `constants/` directory
- Place utility functions in `utils/` directory
- Keep hooks in `hooks/` directory
- Store shared types in `types/` directory

## Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`)
- **Context**: PascalCase with `Context` suffix (e.g., `AuthContext`)
- **Types/Interfaces**: PascalCase (e.g., `UserData`)
- **Functions**: camelCase (e.g., `formatDate`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects

## Code Organization Within Components

1. Import statements
2. Type definitions
3. Component definition
4. Helper functions
5. Export statement

Example:

```tsx
// 1. Imports
import React, { useState } from 'react';
import { someUtil } from '@/utils/someUtil';

// 2. Type definitions
interface ComponentProps {
  // Props definition
}

// 3. Component definition
export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  
  // Return JSX
  return (
    // JSX
  );
}

// 4. Helper functions
function helperFunction() {
  // Implementation
}

// 5. Export (if not exported in the definition)
```
