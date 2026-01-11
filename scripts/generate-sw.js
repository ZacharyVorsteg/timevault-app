// This script can be enhanced to generate service worker with build hashes
// For now, it's a placeholder for the postbuild hook

const fs = require('fs');
const path = require('path');

console.log('Service worker ready at /sw.js');

// In a production setup, you would:
// 1. Read all files from .next/static
// 2. Generate a list of assets to cache
// 3. Update sw.js with versioned cache name
// 4. Copy to public folder or .next

// For this simple setup, the static sw.js works fine
