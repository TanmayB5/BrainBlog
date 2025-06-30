const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Force regenerating Prisma client...');

// Remove existing Prisma client
const prismaClientPath = path.join(__dirname, '../node_modules/.prisma');
if (fs.existsSync(prismaClientPath)) {
  console.log('Removing existing Prisma client...');
  fs.rmSync(prismaClientPath, { recursive: true, force: true });
}

// Generate fresh Prisma client
console.log('Generating fresh Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('Prisma client regenerated successfully!'); 