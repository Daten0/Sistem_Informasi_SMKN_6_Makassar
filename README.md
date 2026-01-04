# Sistem Informasi SMKN 6 Makassar

This is a comprehensive school information system for SMK Negeri 6 Makassar. This web application provides easy access to information about the school, including news, department profiles, teacher information, and more. It features a public-facing website and a dedicated admin dashboard for content management.

## ✨ Primary Features

### Public-Facing Website
*   **🏠 Home Page:** A welcoming landing page with a hero carousel, a message from the principal, and a showcase of teachers.
*   **ℹ️ About Page:** Delve into the school's history and organizational structure.
*   **🎯 Vision & Mission:** Understand the core values and goals of the school.
*   **🎓 Department Profiles:** Detailed information for each vocational department:
    *   Perhotelan (Hospitality)
    *   Kuliner (Culinary)
    *   Busana (Fashion)
    *   Kecantikan (Beauty)
    *   Akuntansi (Accounting)
    *   Desain Komunikasi Visual (DKV)
    *   Each profile includes competencies, career prospects, and facilities.
*   **📰 News & Announcements:** Stay updated with the latest school news.
*   **👩‍🏫 Teacher Directory:** A searchable directory of teacher profiles.

### 🔒 Admin Dashboard
*   **Secure Authentication:** Role-based access for administrators.
*   **News Management (CRUD):** Full control to create, read, update, and delete news articles.
*   **Teacher Management (CRUD):** Easily add, edit, and manage teacher information.

## 🚀 Tech Stack

*   **Frontend:**
    *   **Framework:** [React](https://react.dev/)
    *   **Language:** [TypeScript](https://www.typescriptlang.org/)
    *   **Build Tool:** [Vite](https://vitejs.dev/)
    *   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
    *   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
    *   **Routing:** [React Router](https://reactrouter.com/)
    *   **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
    *   **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
    *   **Icons:** [Lucide React](https://lucide.dev/)
*   **Backend:**
    *   **Backend-as-a-Service (BaaS):** [Supabase](https://supabase.com/) - for database, authentication, and storage.

## 📦 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    cd Sistem_Informasi_SMKN_6_Makassar
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Supabase project URL and anon key. You can find these in your Supabase project's API settings.
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```sh
    bun run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## 🚀 Deployment on Vercel

You can deploy this project to [Vercel](https://vercel.com/), a platform for frontend developers that provides a seamless deployment experience.

### Step-by-Step Deployment

1.  **Fork this repository** to your own GitHub account.

2.  **Go to your Vercel dashboard** and click on **"Add New... -> Project"**.

3.  **Import your forked repository** from GitHub.

4.  **Configure the project:**
    *   **Framework Preset:** Vercel should automatically detect it as a **Vite** project.
    *   **Build & Development Settings:**
        *   **Build Command:** `bun run build` (or `npm run build` if you prefer npm).
        *   **Output Directory:** `dist` (Vercel usually autodetects this for Vite).
        *   **Install Command:** `bun install` (or `npm install`).
    *   **Environment Variables:**
        Add your Supabase project URL and anon key. These are the same variables from your `.env` file.
        *   `VITE_SUPABASE_URL` = `your_supabase_url`
        *   `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`

5.  **Click "Deploy"**. Vercel will build and deploy your site. After a few moments, you'll get a public URL for your live application.

The existing `vercel.json` file in the repository is configured to handle client-side routing for this single-page application, so you don't need to worry about setting up rewrites.

