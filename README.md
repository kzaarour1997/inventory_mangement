# Inventory Management System

A full-stack inventory management system built with Laravel (Backend) and React (Frontend).

## Project Structure

```
inv/
├── inv-back/     # Laravel Backend
└── inv-frontend/ # React Frontend
```

## Backend Setup (Laravel)

1. Navigate to the backend directory:

   ```bash
   cd inv-back
   ```

2. Install dependencies:

   ```bash
   composer install
   ```

3. Create and configure .env file:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Run migrations:

   create a database in the phpmyadmin called inventory_management

5. Run migrations:

   ```bash
   php artisan migrate
   ```

6. Create storage link:

   ```bash
   php artisan storage:link
   ```

7. Start the development server:
   ```bash
   php artisan serve
   ```

## Frontend Setup (React)

1. Navigate to the frontend directory:

   ```bash
   cd inv-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create and configure .env file:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Features

- User authentication
- Product type management
- Item management with serial numbers
- Image upload for product types
- Status tracking for items (sold/available)
- Search functionality
