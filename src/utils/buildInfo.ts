/**
 * Build information for the application
 */

// Generate build ID from current date/time in format: YYYYMMDD-HHMM
const buildDate = new Date();
const year = buildDate.getFullYear();
const month = String(buildDate.getMonth() + 1).padStart(2, '0');
const day = String(buildDate.getDate()).padStart(2, '0');
const hours = String(buildDate.getHours()).padStart(2, '0');
const minutes = String(buildDate.getMinutes()).padStart(2, '0');

export const BUILD_ID = `${year}${month}${day}-${hours}${minutes}`;

// Log build info once when this module is imported
console.log(`🏗️ App Build ID: ${BUILD_ID}`);