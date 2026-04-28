# 📊 Student Performance Tracker

A beautiful DBMS mini-project built with **Next.js** and **Supabase** that tracks student semester performance, generates visual reports, and predicts future marks using the Law of Averages.

## Features

- 🎓 Register students with Name & Roll Number
- 📝 Add marks for each semester (1–8)
- 📈 Beautiful line & bar charts for performance visualization
- 🔮 Predict next semester marks (average of last 3 semesters)
- 🗑️ Full CRUD operations on students and marks
- 🌙 Stunning dark-themed glassmorphism UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend/DB | Supabase (PostgreSQL) |
| Charts | Chart.js + react-chartjs-2 |
| Hosting | Vercel (frontend) + Supabase (backend) |

## Setup Instructions

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings > API** and copy your Project URL and anon key

### 2. Local Development
```bash
# Install dependencies
npm install

# Create env file
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run dev server
npm run dev
```

### 3. Deploy to Vercel
1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Database Schema

```
students
├── id (UUID, PK)
├── name (TEXT)
├── roll_no (TEXT, UNIQUE)
└── created_at (TIMESTAMPTZ)

semester_marks
├── id (UUID, PK)
├── student_id (UUID, FK → students.id)
├── semester (INTEGER, 1-8)
├── marks (DECIMAL, 0-100)
└── created_at (TIMESTAMPTZ)
```

## Prediction Algorithm

Uses the **Law of Averages**: predicted marks = average of the last 3 semester scores.
If fewer than 3 semesters are available, the average of all available semesters is used.
