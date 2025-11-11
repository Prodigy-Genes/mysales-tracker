💰 My Sales Tracker: Real-Time Business Dashboard

This is a professional, authenticated sales and expense tracking dashboard built to provide real-time financial analytics. It was developed collaboratively and is deployed for free on Cloudflare Pages.

🚀 Key Features

Secure Authentication: User sign-in via Google using Firebase Authentication.

Private Data: Firestore Security Rules ensure each user can only access their own sales and expense records.

Real-Time Analytics: Net Income, Total Sales, and Total Expenses are calculated instantly on data entry.

Visual Reports: Weekly Sales Trends (Line Chart) and Expense Breakdown by Category (Pie Chart).

Performance: Built with Next.js (TypeScript) and deployed on Cloudflare Pages for speed and reliability.

🛠️ Technology Stack

Framework: Next.js 14+ (App Router)

Language: TypeScript

Styling: Tailwind CSS

Database & Auth: Google Firebase (Authentication & Firestore)

Charts: Recharts

Deployment: Cloudflare Pages

⚙️ Setup and Installation

1. Initial Setup

Clone the repository:

git clone https://github.com/Prodigy-Genes/mysales-tracker.git

cd mysales-tracker


Install dependencies using pnpm:

pnpm install


2. Firebase Configuration (CRITICAL)

You must set up a Firebase project and enable Google Sign-In under the Authentication tab.

Create a file named .env.local in the root directory.

Add your Firebase credentials using the NEXT_PUBLIC_ prefix:

# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""


3. Database Security

The application uses path-based security to ensure data is private. You must apply these rules in your Firebase Console (Firestore Database > Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
         allow read, write: if request.auth.uid != null && request.auth.uid == userId;
    }
  }
}


4. Running Locally

pnpm dev


Open http://localhost:3000 to view the application.

🌐 Deployment to Cloudflare Pages

The app is configured for free deployment via GitHub integration with Cloudflare Pages.

Connect GitHub: In the Cloudflare Dashboard, create a new Pages project and connect it to this GitHub repository.

Build Settings: Use the following configuration:

Framework: Next.js

Build command: pnpm run build

Build output directory: out

Environment Variables: Manually add all NEXT_PUBLIC_FIREBASE_... keys and their corresponding values to the Environment variables section in Cloudflare Pages settings.

Compatibility Flag (Crucial Fix): To resolve Node.js compatibility errors, you must add the following flag in Settings > Functions > Compatibility Flags:

Flag Name: nodejs_compat_populate_process_env

Apply to: Production and Preview

This configuration ensures a stable build and runtime environment for your Next.js application on Cloudflare.
