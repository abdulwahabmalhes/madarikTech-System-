#!/bin/bash
# deploy.sh - Deploy Laravel backend on Hostinger VPS/Cloud
# -------------------------------------------------------
# Usage: ssh user@host "bash -s" < deploy.sh
#        (or run locally if repository is already on the server)

set -e

# 1. Pull latest code from GitHub
REPO_URL="https://github.com/abdulwahabmalhes/madarikTech-System-.git"
PROJECT_DIR="$(pwd)"
if [ -d "$PROJECT_DIR/.git" ]; then
  echo "Fetching latest changes..."
  git pull origin main
else
  echo "Cloning repository..."
  git clone "$REPO_URL" .
fi

# 2. Install PHP dependencies (no dev packages)
composer install --no-dev --optimize-autoloader

# 3. Install Node dependencies for frontend (optional, see frontend script)
# npm ci && npm run build

# 4. Prepare environment file
if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
fi
# NOTE: Edit .env to set DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD, etc.

# 5. Generate application key
php artisan key:generate

# 6. Run database migrations and seeders (force for production)
php artisan migrate --force
php artisan db:seed --force

# 7. Cache configuration, routes and views for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Set proper permissions (adjust USER and GROUP if needed)
CHOWN_USER="www-data"
CHOWN_GROUP="www-data"
find storage -type d -exec chmod 775 {} +
find bootstrap/cache -type d -exec chmod 775 {} +
chown -R $CHOWN_USER:$CHOWN_GROUP storage bootstrap/cache

# 9. Create storage symlink if not exists
if [ ! -L public/storage ]; then
  php artisan storage:link
fi

echo "✅ Deployment completed successfully!"
