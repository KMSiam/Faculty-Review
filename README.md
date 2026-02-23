# FacultyReview

A full-stack professor rating website similar to RateMyProfessors. Built with modern web technologies and a focus on premium user experience.

## Features

- **User Authentication**: Sign up, Login, and secure JWT-based sessions.
- **Professor Directory**: Search professors by name, department, or university.
- **Review System**: Detailed ratings for overall quality and difficulty with student comments. 
- **User Dashboard**: Manage your profile and track all your submitted reviews.
- **Modern UI**: Dark-themed, mobile-responsive design with glassmorphism and smooth animations.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, JWT, bcryptjs.
- **Database**: MongoDB (Local).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Running locally on port 27017)

### Installation

1. **Clone or Download** the project.
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   ```

### Running Locally

You will need two terminal windows open:

**Terminal 1 (Backend)**:
```bash
cd backend
npm start
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## Environment Variables

The backend uses a `.env` file with the following defaults:
- `MONGO_URI`: `mongodb://localhost:27017/facultyreview`
- `JWT_SECRET`: `dev_secret_change_me_in_production`
- `PORT`: `5000`
