/**
 * Build information for the application
 */

// Declare the global build ID injected by Vite at compile time
declare const __BUILD_ID__: string;

// Use the compile-time build ID if available, otherwise fallback to runtime generation
export const BUILD_ID = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : (() => {
  const buildDate = new Date();
  const year = buildDate.getUTCFullYear();
  const month = String(buildDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(buildDate.getUTCDate()).padStart(2, '0');
  const hours = String(buildDate.getUTCHours()).padStart(2, '0');
  const minutes = String(buildDate.getUTCMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
})();

// Log build info once when this module is imported
console.log(`🏗️ App Build ID: ${BUILD_ID} (${typeof __BUILD_ID__ !== 'undefined' ? 'compile-time' : 'runtime'})`);