
# Library Management System

A comprehensive library management system built with React, TypeScript, and Supabase.

## Requirements

### Software Requirements
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (or **Bun**: Latest version)
- **Git**: For version control

### Dependencies

#### Core Dependencies
- **React**: ^18.3.1
- **TypeScript**: Latest
- **Vite**: Latest (build tool)
- **Tailwind CSS**: Latest (styling)

#### UI Components
- **@radix-ui/react-***: Complete UI component library
- **lucide-react**: ^0.462.0 (icons)
- **class-variance-authority**: ^0.7.1 (component variants)
- **clsx**: ^2.1.1 (conditional classes)
- **tailwind-merge**: ^2.5.2 (class merging)

#### Backend & Database
- **@supabase/supabase-js**: ^2.53.0
- **@tanstack/react-query**: ^5.56.2 (data fetching)

#### Forms & Validation
- **react-hook-form**: ^7.53.0
- **@hookform/resolvers**: ^3.9.0
- **zod**: ^3.23.8

#### QR Code Functionality
- **qrcode**: ^1.5.3 (QR generation)
- **qr-scanner**: ^1.4.2 (QR scanning)
- **@types/qrcode**: ^1.5.5

#### Charts & Analytics
- **recharts**: ^2.12.7

#### PDF & File Handling
- **jspdf**: ^2.5.1
- **html2canvas**: ^1.4.1

#### Routing & Navigation
- **react-router-dom**: ^6.26.2

#### UI Enhancements
- **sonner**: ^1.5.0 (toast notifications)
- **next-themes**: ^0.3.0 (theme switching)
- **@studio-freight/lenis**: ^1.0.42 (smooth scrolling)
- **embla-carousel-react**: ^8.3.0 (carousels)
- **date-fns**: ^3.6.0 (date utilities)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using Bun (recommended for faster installation)
bun install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase)
1. Create a new Supabase project
2. Run the provided SQL migration in the Supabase SQL editor
3. Enable Row Level Security (RLS) on all tables
4. Set up authentication providers as needed

### 5. Development Server
```bash
# Using npm
npm run dev

# Using Bun
bun run dev
```

The application will be available at `http://localhost:8080`

## Features

- **Authentication System**: Complete user authentication with role-based access
- **Book Management**: Add, edit, search, and manage books with QR codes
- **Member Management**: Comprehensive member profiles and management
- **Transaction System**: Book issuing, returning, and tracking
- **QR Code System**: Generate and scan QR codes for books and members
- **Fine Management**: Automatic fine calculation and payment tracking
- **Reservation System**: Book reservation and queue management
- **Reports & Analytics**: Comprehensive reporting with charts and exports
- **Real-time Updates**: Live dashboard with real-time statistics
- **File Upload**: Image upload for books and member profiles
- **Dark/Light Mode**: Complete theme switching support
- **Responsive Design**: Mobile-first responsive design

---

## Build for Production

```bash
# Using npm
npm run build

# Using Bun
bun run build
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Charts**: Recharts
- **QR Codes**: qrcode, qr-scanner
- **Forms**: React Hook Form, Zod validation
- **State Management**: React Query, React Context
- **Routing**: React Router v6

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📞 Author <br>
VEDAANSH VISHWAKARMA <br>
Linkedin : https://www.linkedin.com/in/vedaansh-vishwakarma-057a7124b/


# Librosphere

