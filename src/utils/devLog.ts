/**
 * Development-only logging utilities
 * Production builds will have these logs stripped out
 */

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('lovableproject.com');

export const devLog = {
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
  
  // Always log in production for critical issues
  critical: (...args: any[]) => {
    console.error(...args);
  }
};

export { isDevelopment };