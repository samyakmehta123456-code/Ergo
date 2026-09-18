# Ergo — Task & Project Management Application

Ergo is a full-stack task and project management application built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and Supabase. It provides a clean, responsive workflow for managing personal and team projects, tracking deadlines, and categorizing tasks into custom user-defined projects.

---

## Features

- **Project-Based Task Management**: Group tasks into custom user-defined projects, view project task counts, and add new projects on the fly.
- **Smart Views**: Fast filtering for Today, Weekly, Monthly, Flagged, Completed, and All tasks.
- **Interactive Calendar Widget**: View monthly calendar layouts with task indicator dots, select specific dates, and view scheduled tasks for any selected day.
- **Global Search**: Search across all tasks in the workspace by title, description, or project name in real time.
- **Task Flagging**: Mark urgent or high-priority tasks with a single click to track them under the Flagged view.
- **Supabase Auth & Database Integration**: User registration, login, and session persistence backed by Supabase Auth and database tables.
- **Progress & Productivity Tracking**: Hero progress panel showcasing completion percentage and task metrics.
- **Responsive Navigation**: Collapsible sidebar navigation with compact icon views for small screens.
- **CSV Data Export**: Export task records into CSV format for data backup.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Database & Client**: Prisma ORM & Supabase Client (`@supabase/supabase-js`)
- **Authentication**: Supabase Auth + JWT cookie session handling
- **Validation**: Zod schema validation
- **Notifications**: Sonner toast notifications

---

## Setup & Installation

### Prerequisites

- Node.js v18.0.0 or later
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/samyakmehta123456-code/Ergo.git
   cd Ergo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   DATABASE_URL=file:./dev.db
   JWT_SECRET=your-secure-jwt-secret
   ```

4. Initialize Database:
   ```bash
   npx prisma db push
   ```

5. Run Development Server:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser.

---

## Production Build

To test or generate a production build locally:

```bash
npm run build
npm run start
```

---

## Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables specified in `.env.local` to Vercel Project Settings.
4. Deploy the project.
