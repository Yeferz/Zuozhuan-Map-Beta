const fs = require('fs');
const crypto = require('crypto');

const jsFilePath = 'index.js';
const htmlFilePath = '../index.html';

// Read the content of the JavaScript file
const jsContent = fs.readFileSync(jsFilePath, 'utf8');

// Calculate the SHA-256 hash
const hash = crypto.createHash('sha256').update(jsContent).digest('base64');

// Read the HTML file and update the hash in the integrity attribute
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
htmlContent = htmlContent.replace(/integrity="sha256-[A-Za-z0-9+/=]+"/, `integrity="sha256-${hash}"`);

// Write the updated HTML content back to the file
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

console.log('Hash updated successfully.');
