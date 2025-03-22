# BusboyPOS - Restaurant Management System

A modern, full-stack Point of Sale and Restaurant Management System built with React, TypeScript, and Supabase.

## Features

- **Restaurant Management**: Manage restaurant details, tables, and staff
- **Menu Management**: Create and manage menu items, categories, and modifiers
- **Order Management**: Take orders, send to kitchen, and process payments
- **Reservation System**: Manage table reservations and schedule
- **Analytics and Reporting**: Sales reports, inventory tracking, and business insights

## Tech Stack

- Frontend: React, TypeScript, Redux Toolkit, Tailwind CSS
- Backend: Supabase (PostgreSQL, Authentication, Storage)
- Database Migration System: Custom migration scripts

## Database Migration System

The project includes a custom database migration system that allows for:

- Creating new migrations with `node scripts/create-migration.js`
- Applying migrations with `node scripts/safe-migrate.js`
- Backing up the database with `node scripts/backup-db.js`

Migrations are stored in the `supabase/migrations` directory.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/youqi42/busboyPOS.git
   cd busboyPOS
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials

4. Run the database migrations:
   ```
   node scripts/safe-migrate.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

