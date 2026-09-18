# Ergo — Student Task Management Application

Ergo is a modern, full-stack student task and project management application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Supabase (PostgreSQL)**. It is designed to help students organize academic coursework, project deliverables, personal tasks, and deadlines through a responsive dashboard.

---

## Application Links

- **Live Deployment**: [https://lunorsoft-taskflow.vercel.app](https://lunorsoft-taskflow.vercel.app)
- **GitHub Repository**: [https://github.com/samyakmehta123456-code/Ergo](https://github.com/samyakmehta123456-code/Ergo)

---

## Tech Stack & Architecture

- **Frontend Framework**: Next.js 14 (App Router) with TypeScript & React 18
- **Styling & UI**: Tailwind CSS, Lucide Icons, Framer Motion, Sonner Toast Notifications
- **Backend Architecture**: Next.js Server-side API Route Handlers (`/api/tasks`, `/api/auth/*`, `/api/stats`)
- **Database & ORM**: Prisma ORM connected to **Supabase PostgreSQL** (Production) / SQLite (Local Dev)
- **Authentication**: JWT tokens stored in HTTP-Only cookies + Supabase Auth helpers
- **Validation**: Zod schema validation for client forms and server payloads
- **Hosting & Deployment**: **Vercel** CI/CD with automated Prisma schema generation

---

## Application Functionality

- **Task Management**: Full CRUD operations to create, edit, delete, and manage task lifecycle states (Pending, In Progress, Completed).
- **Subject & Project Categorization**: Group tasks by academic subjects (Computer Science, Mathematics, Physics, Lab Work) or custom project folders.
- **Priority & Due Date Tracking**: Assign priority levels (Low, Medium, High, Urgent) and set specific deadline target dates.
- **Interactive Calendar View**: Monthly calendar widget with interactive date selection to inspect scheduled items for any selected day.
- **Real-time Search & Filtering**: Global search across all tasks alongside smart category filters (Today, Weekly, Monthly, Flagged, Completed).
- **User Authentication**: User registration, login, and stateless JWT session management backed by HTTP-Only cookies.
- **Analytics & Progress Metrics**: Dashboard analytics with completion rate progress bar and category breakdown.
- **Data Export**: CSV data export capability for task records and offline backups.

---

## Architecture & Implementation Overview

- **Cloud Database Configuration**: Configured Supabase PostgreSQL database project instance with direct and pooled connection strings (`DATABASE_URL`).
- **Prisma Relational Schema**: Designed relational schemas (`User` and `Task` models), database indexes, and relational cascade constraints (`onDelete: Cascade`).
- **Production Deployment**: Integrated repository with **Vercel** CI/CD pipeline, environment variable injection, and dynamic build scripts.
- **Authentication Security**: Implemented JWT cookie security (`SameSite=Lax`, `HttpOnly`), middleware route guards, and authenticated session handlers.
- **Optimistic State Updates**: Implemented optimistic React state updates for UI interactions (status toggle, flag toggle, task deletion) with automatic rollback on network failure.

---

## Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **Supabase Account** (or local SQLite for dev testing)

### Step-by-Step Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/samyakmehta123456-code/Ergo.git
   cd Ergo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the project root:
   ```env
   # Database connection (SQLite for local dev, PostgreSQL for production Supabase)
   DATABASE_URL="file:./dev.db"

   # Supabase Credentials (from Supabase Project Settings -> API)
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-supabase-anon-key"

   # JWT Auth secret key for session signing
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

4. **Initialize Database Schema**:
   ```bash
   npx prisma db push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment (Vercel + Supabase)

To deploy to Vercel:

1. Push your repository to **GitHub**.
2. Connect your repository on **Vercel**.
3. In **Vercel Project Settings -> Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase PostgreSQL Connection String.
   - `JWT_SECRET`: A secure random secret key.
4. Set the Build Command in Vercel to:
   ```bash
   prisma generate && next build
   ```
5. Deploy. Vercel will automatically build the Next.js app and connect to Supabase.

---

## Key Technical Decisions

- **HTTP-Only Cookie Authentication**: Prevents client-side script access to session tokens, protecting against XSS vulnerabilities.
- **Prisma ORM with PostgreSQL**: Provides strong type safety, dynamic query building, and database schema migrations.
- **Optimistic State Synchronization**: Delivers immediate UI responsiveness for task actions while ensuring data integrity.
