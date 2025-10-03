#!/bin/bash

echo "🚀 Starting Laravel application..."

# Generate .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.production .env
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate --force
php artisan db:seed --force

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Start server
echo "Starting PHP server on port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT