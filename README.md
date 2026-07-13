# Swagger Editor App

RS School React course project.

**Deploy:** https://swagger-editor-app-xi.vercel.app/
**Demo video:** https://youtu.be/6nPWYDlDcbc

## Features

- OpenAPI editor (JSON/YAML, validation, convert)
- Swagger Viewer + Try It Out (server proxy)
- Auth (Supabase)
- Schema save for authenticated users
- Request history & analytics
- i18n (EN/RU)

## Tech stack

Next.js, React, TypeScript, Tailwind, next-intl, Supabase, Vitest

## Setup

### 1. Install

npm install

### 2. Environment variables (.env.local)

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

### 3. Supabase database

Run supabase/schema.sql in Supabase SQL Editor.

### 4. Run locally

npm run dev

### 5. Tests

npm run test
npm run test:coverage
