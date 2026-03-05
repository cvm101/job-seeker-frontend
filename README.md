---

# 🚀 JobHunter Engine

**JobHunter Engine** is an automated, AI-powered job search assistant. It combines a Next.js frontend dashboard with a secure backend engine powered by GitHub Actions. Users can input their skills, experience, and cover letter templates to automatically scrape, match, and generate tailored applications for highly relevant jobs.

## ✨ Key Features

* **⚡ Hybrid Execution:** Runs automatically on a daily schedule (Cron) or on-demand via a secure Next.js API trigger.
* **🧠 AI-Powered Matching:** Analyzes job descriptions against user profiles to generate a "Match Score."
* **📝 Auto-Cover Letters:** Generates customized, ready-to-copy cover letters based on the user's saved templates and the specific job requirements.
* **🔒 Secure Architecture:** Utilizes server-side Next.js API routes to securely interact with the GitHub API without exposing authentication tokens to the client browser.
* **📊 Real-time Dashboard:** Built with React and Tailwind CSS, providing a sleek interface to update user profiles, view job matches, and apply directly.

---

## 🏗️ Architecture

1. **Frontend (Next.js):** Hosts the user authentication (via Supabase) and the main dashboard UI.
2. **Database (Supabase):** Stores user profiles, application templates, and the fetched/matched job data.
3. **Backend Engine (GitHub Actions):** A separate repository containing `daily-fetch.yml` that handles the heavy lifting of scraping jobs, consulting the AI, and saving matches to the database.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router / Pages)
* **Styling:** Tailwind CSS
* **Authentication & Database:** Supabase
* **Automation:** GitHub Actions (Workflow Dispatch & Schedule)
* **Language:** TypeScript / React

---

## 🚦 Getting Started

### Prerequisites

Before running this project, you will need:

* Node.js v20+
* A [Supabase](https://supabase.com/) account and project.
* A GitHub Personal Access Token (PAT) with `repo` permissions to trigger the backend engine.

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/job-seeker-frontend.git
cd job-seeker-frontend

```


2. **Install dependencies:**
```bash
npm install

```


3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your secure keys. **Never commit this file to version control.**
```env
# Supabase Public Keys (Safe for Browser)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Master Token (Backend ONLY - Do not add NEXT_PUBLIC)
GITHUB_TOKEN=ghp_your_personal_access_token_here

```


4. **Run the development server:**
```bash
npm run dev

```


5. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 📖 Usage

1. **Create an Account:** Sign up using the secure Supabase authentication portal.
2. **Configure Your Engine:** Fill out your First Name, Last Name, Skills, and Years of Experience in the Engine Settings panel.
3. **Save Your Template:** Write a base cover letter template for the AI to utilize.
4. **Trigger the Hunt:** Click **"⚡ Run Engine Now"** to ping the GitHub Actions backend. Give it a minute to run the AI, then refresh the page to view your top job matches!

---

## 🛡️ Security Note

This project utilizes a GitHub Personal Access Token to trigger external workflows. To prevent unauthorized access to your GitHub repositories, this token is strictly managed via a Next.js Server API Route (`/api/trigger/route.ts`). Ensure your production environment (e.g., Vercel) stores this as a standard environment variable, **not** prefixed with `NEXT_PUBLIC_`.

---
