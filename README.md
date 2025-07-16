# 🦷 DentalEase Patient/Doctor Management System

DentalEase is a modern web application designed to streamline patient and doctor management for dental clinics. Built with Next.js and React, it provides an intuitive interface for both patients and healthcare professionals.

## ✨ Features

- 👩‍⚕️ Patient and doctor management
- 📅 Appointment scheduling
- 💳 Billing and payments
- 💊 Inventory and prescription management
- 🏥 Clinic information and announcements
- 🤖 AI chat support

## ⚙️ Setup & Installation

### 📋 Prerequisites

- 🟢 Node.js (v18 or higher recommended)
- 📦 npm (v9 or higher) or yarn

### 🛠️ Installation Steps

1. 📥 Clone the repository:

   git clone https://github.com/itsmenoahpoli/capstone-dentalease-ui-app.git
   cd capstone-dentalease-ui-app

2. 📦 Install dependencies:

   npm install

   # or

   yarn install

3. ⚙️ Copy and configure environment variables if needed (see `.env.example` if available).

### 🚀 Running the App Locally

To start the development server:

npm run dev

# or

yarn dev

The app will be available at [http://localhost:3000](http://localhost:3000).

To build for production:

npm run build

To start the production server:

npm run start

## ☁️ Deployment Guide (Vercel)

The easiest way to deploy DentalEase is via [Vercel](https://vercel.com/):

1. 🗂️ Push your code to a GitHub, GitLab, or Bitbucket repository.
2. 🌐 Go to [Vercel](https://vercel.com/) and sign up/log in.
3. ➕ Click "New Project" and import your repository.
4. 🛠️ Vercel will auto-detect the Next.js app. Use the default build settings.
5. 🚀 Click "Deploy". Your app will be live in seconds.

For custom domains and environment variables, use the Vercel dashboard settings.

## 🌳 Branching Strategy

- `main` 🟢: Stable, production-ready code. All releases are merged here.
- `develop` 🛠️: Active development branch. All features and fixes branch off from here.
- `feature/xyz` ✨: For new features. Branch off from `develop`.
- `fix/xyz` 🐞: For bug fixes. Branch off from `develop`.
- `release/xyz` 🚢: For preparing a new production release. Merge feature/fix branches here, then into `main`.
- `hotfix/xyz` 🔥: For urgent fixes on production. Branch off from `main`, then merge back to both `main` and `develop`.

## 🤝 Contributing

1. 🍴 Fork the repository and create your feature/fix branch.
2. 💾 Commit your changes with clear messages.
3. 📤 Push to your fork and open a pull request against the appropriate branch.

## 📄 License

Specify your license here (e.g., MIT, Apache 2.0, etc.)
