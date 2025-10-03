#!/bin/bash

echo "Starting deployment process..."

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Run migrations
php artisan migrate --force
php artisan db:seed --force

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Build frontend assets
npm run build

# Start server
echo "Starting PHP server..."
php artisan serve --host=0.0.0.0 --port=$PORT

echo "Deployment completed!"