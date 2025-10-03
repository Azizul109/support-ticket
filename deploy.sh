#!/bin/bash

echo "Starting deployment process..."

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Build frontend assets
npm run build

echo "Deployment completed!"