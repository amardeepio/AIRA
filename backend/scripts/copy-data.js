const fs = require('fs');
const path = require('path');

// Create the dist directory if it doesn't exist
const distDir = path.resolve(__dirname, '../dist/properties');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy the data file from the data directory to the dist directory
const sourceFile = path.resolve(__dirname, '../data/properties.data.json');
const destFile = path.resolve(__dirname, '../dist/properties/properties.data.json');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('Copied properties.data.json to dist directory');
} else {
  // Create an empty data file if it doesn't exist
  const emptyData = [];
  fs.writeFileSync(destFile, JSON.stringify(emptyData, null, 2));
  console.log('Created empty properties.data.json in dist directory');
}