# Event Manager Frontend

## Overview
A modern React application for managing events, built with TypeScript and Tailwind CSS. This application provides a complete interface for event management, user authentication, and registration handling.

## Features
- 🔐 User authentication (login/register)
- 📅 Event management (create, read, update, delete)
- 🎫 Event registration system
- 👥 User profile management
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔍 Event search and filtering
- 📊 Dashboard with event statistics

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- Zustand (State Management)
- Axios
- Zod (Validation)
- Lucide React (Icons)

## Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

## Installation
1. Clone the repository
```bash
git clone https://github.com/ainemehdi6/events-management-front
cd events-management-front
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_KEY=your_api_key
```

4. Start the development server
```bash
npm run dev
```

## Project Structure
```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── services/         # API service layers
├── stores/           # Zustand stores
├── types/            # TypeScript type definitions
├── lib/             # Utility functions and constants
└── App.tsx          # Root component
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint