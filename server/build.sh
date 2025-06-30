#!/bin/bash

# Force clear any cached Prisma files
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Reinstall dependencies
npm install

# Generate fresh Prisma client
npx prisma generate

# Push schema to database (this will create tables if they don't exist)
npx prisma db push

echo "Build completed successfully!" 