# Ergo — Student Task Management Application

Ergo is a modern, full-stack student task and project management application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Supabase (PostgreSQL)**. It is designed to help students organize academic coursework, project deliverables, personal tasks, and deadlines through a responsive dashboard.

---

## Submission Links

- **Live Deployment (Vercel)**: [https://lunorsoft-taskflow.vercel.app](https://lunorsoft-taskflow.vercel.app)
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

## Key Features

### Core Functionality
- [x] **Create Tasks**: Add tasks with title, description, priority, category, and due date.
- [x] **Edit Tasks**: Update existing task details dynamically through interactive modals.
- [x] **Delete Tasks**: Remove tasks safely with instant database cascade updates.
- [x] **Mark Completed/Pending**: Single-click status toggling with optimistic UI updates.
- [x] **View Pending & Completed Tasks**: Dedicated tabs and status indicators.
- [x] **Filter & Organize**: Categorize by academic subjects (CS, Math, Physics, Lab Work) or personal projects.
- [x] **Database Persistence**: Fully backed by Supabase PostgreSQL in production via Prisma ORM.
- [x] **Clean & Responsive UI**: Responsive sidebar, mobile bottom navigation, and card grids.

### Advanced Features
- [x] **User Authentication**: Secure user registration, login, and session persistence.
- [x] **Live Global Search**: Instant keyword search across task titles, descriptions, and categories.
- [x] **Task Priority & Due Dates**: Priority levels (Low, Medium, High, Urgent) and calendar date picking.
- [x] **Dashboard Analytics & Progress Hero**: Visual progress bar and task completion stats.
- [x] **Interactive Calendar Widget**: Monthly view showcasing scheduled task indicators per day.
- [x] **Data Export**: One-click CSV export of task records for backup.
- [x] **Live Production Deployment**: Hosted on Vercel with connected Supabase cloud database.

---

## Architecture & Implementation Overview

- **Supabase Cloud Database Setup**: Configured Supabase PostgreSQL database project instance, established direct and pooled connection strings, and configured environment variables (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Prisma Relational Database Architecture**: Designed relational schemas (`User` and `Task` models), configured database indexes, defined field constraints (`onDelete: Cascade`), and executed migrations (`npx prisma db push`).
- **Vercel Deployment & Configuration**: Connected GitHub repository to **Vercel**, configured build scripts (`prisma generate && next build`), injected secure production environment variables, verified domain resolution, and tested live production endpoints.
- **Custom Authentication & Cookie Security**: Engineered session management using `jose` JWTs in HTTP-Only, `SameSite=Lax` cookies, integrated middleware route protection, and bridged Supabase Auth state.
- **Optimistic State Management & Logic**: Wrote state synchronization logic in React components to ensure instant UI feedback during task creation, deletion, and completion toggles.
- **Testing & Quality Assurance**: Verified all application links, authentication flows, and data persistence in incognito browser sessions prior to final submission.

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

- **Why HTTP-Only Cookies for Auth?**: Prevents XSS attacks by withholding token access from client-side JavaScript, ensuring tokens are automatically passed securely via HTTP headers.
- **Why Prisma + Supabase?**: Combines the type-safety and auto-generated migrations of Prisma ORM with the scalability and PostgreSQL hosting of Supabase.
- **Optimistic UI Updates**: Instant state updates on user action, rolled back automatically with toast notifications if the API request fails.
