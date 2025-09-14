const fs = require('fs');
const path = require('path');

// Create the data directory if it doesn't exist
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create an empty data file if it doesn't exist
const dataFile = path.resolve(__dirname, '../data/properties.data.json');
if (!fs.existsSync(dataFile)) {
  const emptyData = [];
  fs.writeFileSync(dataFile, JSON.stringify(emptyData, null, 2));
  console.log('Created empty properties.data.json in data directory');
}