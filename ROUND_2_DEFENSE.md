# Round 2 Technical Explanation & Defense Guide

Prepared for selection process.

---

## 2-Minute Video Explanation Script

### Section 1: Introduction & Problem Statement (0:00 - 0:30)
> *"Hello, my name is [Your Name], and this is my application submission: **Ergo** — a full-stack project and task management platform.*
> *Tracking assignment deadlines, project deliverables, and task dates across multiple projects can quickly become overwhelming. Ergo solves this by combining modern visual design, real-time filtering, project categorization, interactive calendar widgets, and global search."*

### Section 2: Technical Stack & Architecture (0:30 - 1:15)
> *"For the full-stack architecture, I chose **Next.js 14 with TypeScript** using the App Router.
> - **Backend & Security**: API route handlers manage business logic. Authentication uses stateless JWT tokens in HTTP-only cookies alongside Supabase Auth for session management. Next.js Middleware intercepts protected routes.
> - **Database**: I used **Prisma ORM** with local SQLite and Supabase PostgreSQL integration.
> - **Validation & UI**: Shared **Zod schemas** validate data on both client forms and API payloads. The UI is built with **Tailwind CSS**, featuring custom project management views and interactive calendar widgets."*

### Section 3: Feature Demonstration (1:15 - 1:45)
> *"Key features in action:
> 1. **Project Management**: Users can create custom projects and categorize tasks under individual project folders.
> 2. **Interactive Calendar**: The right panel features a monthly calendar with date selection that filters tasks for any clicked date.
> 3. **Global Search**: Real-time search across all tasks in the workspace.
> 4. **CSV Export**: Users can export their full task list with one click."*

---

## Technical Interview Questions & Answers

### Q1: Why did you choose JWT stored in HTTP-Only Cookies over LocalStorage?
**Answer**: LocalStorage is vulnerable to Cross-Site Scripting (XSS) attacks because JavaScript running on the page can access stored tokens. By storing JWTs in `httpOnly`, `SameSite=Lax` cookies, the browser automatically attaches credentials to requests while preventing client-side scripts from reading the token.

### Q2: How do you handle optimistic UI updates when marking a task as completed?
**Answer**: When a user clicks the completion checkmark, the component immediately updates local React state (`setTasks`) to reflect the completed state before waiting for the network request. If the backend `PUT /api/tasks/[id]` request fails, a catch block displays a toast notification and re-fetches the server state to roll back gracefully.
