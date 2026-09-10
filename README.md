🤖 AI-Powered Applicant Tracking System

An AI-powered Applicant Tracking System (ATS) built with the MERN stack to simplify the recruitment process for recruiters and applicants.

The system allows recruiters to create and manage job openings, while applicants can browse jobs, upload resumes, and receive AI-powered resume analysis. Recruiters can rank candidates, filter applications, manage the recruitment pipeline, and receive application-status workflows.

📌 Project Overview

Traditional recruitment often requires recruiters to manually review large numbers of resumes. This project uses AI to assist recruiters by analyzing an applicant's resume against a job description and generating a structured analysis.

Core Flow

Applicant
   │
   ├── Register / Login
   │
   ├── Browse Jobs
   │
   ├── Apply for Job
   │
   └── Upload Resume (PDF)
            │
            ▼
      PDF Text Extraction
            │
            ▼
       AI Resume Analysis
            │
            ▼
   ┌─────────────────────────┐
   │ Match Score             │
   │ Skills                  │
   │ Experience              │
   │ Strengths               │
   │ Missing Skills          │
   │ Summary                 │
   └─────────────────────────┘
            │
            ▼
       Application Stored
            │
            ▼
       Recruiter Dashboard
            │
            ├── Candidate Ranking
            ├── Search & Filters
            ├── AI Score Sorting
            └── Application Pipeline
                         │
                         ▼
                 Status Update
                         │
                         ▼
                  Email Notification

✨ Features

👤 Applicant

Applicant registration and login

JWT-based authentication

Browse active job openings

View job details

Apply for jobs

Upload resume PDF

Automatic PDF text extraction

AI-powered resume analysis

AI match score

View extracted skills

View experience analysis

View strengths

View missing skills

View AI-generated summary

Track submitted applications

View application status

👔 Recruiter

Recruiter registration and login

Protected recruiter dashboard

Create job openings

Update job openings

Archive job openings

View candidates for a job

AI-powered candidate ranking

Search candidates by name/email

Filter candidates by application status

Filter candidates by minimum AI score

Sort candidates by AI score

Sort candidates by application date

View detailed AI analysis

Recruitment application pipeline

Update candidate application status

Email notifications when application status changes

🔐 Security

JWT authentication

Password hashing with bcrypt

Role-based authorization

Protected frontend routes

Recruiter/applicant access separation

Environment variables for sensitive credentials

Resume upload handling

🛠️ Technology Stack

Frontend

React

Vite

React Router

Axios

JavaScript

CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Multer

PDF Parse

Nodemailer

AI

Google Gemini API

AI-powered resume and job-description comparison

Structured candidate analysis

Match scoring

Development Tools

Git

GitHub

Postman

Nodemon

ESLint

🏗️ Project Structure

task-management-system/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── role.js
│   │   └── uploadResume.js
│   │
│   ├── models/
│   │   ├── application.js
│   │   ├── job.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authroute.js
│   │   ├── jobRoutes.js
│   │   └── ...
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   └── emailService.js
│   │
│   ├── utils/
│   │   └── resumeParser.js
│   │
│   ├── uploads/
│   │   └── resumes/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── useAuth.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JobBoard.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── ApplyJob.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── CandidateRanking.jsx
│   │   │   └── ApplicationPipeline.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md

⚙️ Prerequisites

Install the following before running the project:

Node.js

npm

MongoDB

Git

Google Gemini API key

Gmail account with an App Password (for email notifications)

🚀 Installation

1. Clone the repository

git clone https://github.com/RammiNandanwar/task-management-system.git

cd task-management-system

🔧 Backend Setup

Open a terminal:

cd backend

Install dependencies:

npm install

Create a .env file inside the backend folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_email@gmail.com

EMAIL_PASSWORD=your_gmail_app_password

Start backend in development mode

npm run dev

Backend runs on:

http://localhost:5000

🎨 Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

Vite will display the local development URL in the terminal, normally:

http://localhost:5173

🔑 Environment Variables

Never commit your .env file.

The backend requires:

Variable

Purpose

PORT

Backend server port

MONGO_URI

MongoDB connection

JWT_SECRET

JWT signing secret

GEMINI_API_KEY

Google Gemini API authentication

EMAIL_USER

Email sender account

EMAIL_PASSWORD

Gmail App Password

Add .env to .gitignore.

🔌 API Overview

Authentication

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Jobs

GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id

Applications

POST  /api/applications/jobs/:jobId
GET   /api/applications/my
GET   /api/applications/job/:jobId
PATCH /api/applications/:applicationId/status

🤖 AI Resume Analysis

When an applicant submits a resume:

Resume PDF
    ↓
PDF Text Extraction
    ↓
Extracted Resume Text
    +
Job Description
    ↓
Google Gemini API
    ↓
Structured AI Analysis

The analysis contains:

Match score

Skills

Experience

Strengths

Missing skills

Summary

The analysis is stored with the applicant's application and can be reviewed by recruiters.

📊 Candidate Ranking

Recruiters can review applicants according to their AI match score.

Candidate ranking supports:

Highest AI score first

Lowest AI score first

Newest applications

Oldest applications

Candidate search

Status filtering

Minimum AI score filtering

Detailed AI analysis

🔄 Recruitment Pipeline

Applications can move through the following stages:

Applied
   ↓
Shortlisted
   ↓
Interview
   ↓
Selected

Applications can also be marked:

Rejected

Recruiters can change the application status from the candidate ranking or pipeline interface.

📧 Email Notifications

When a recruiter changes an applicant's status, the system can send an email notification.

Examples:

Application shortlisted

Interview stage

Candidate selected

Application rejected

Email delivery uses Nodemailer with Gmail SMTP.

🛡️ Authentication & Authorization

The system uses JWT-based authentication.

Applicant

Applicants can:

Browse jobs

Apply for jobs

Upload resumes

View their applications

Recruiter

Recruiters can:

Create jobs

Manage their jobs

View candidates

Rank candidates

Manage application status

Protected routes prevent unauthenticated users from accessing authenticated pages.

🧪 Testing

The backend APIs can be tested using Postman.

Recommended testing sequence:

Register an applicant.

Register a recruiter.

Login as recruiter.

Create a job.

Login as applicant.

Browse the job.

Apply with a PDF resume.

Verify AI analysis.

Login as recruiter.

View candidates.

Filter/rank candidates.

Change application status.

Verify email notification.

📌 Current Development Status

The project currently includes the main ATS workflow:

Authentication

Role-based access

Job management

Resume upload

PDF extraction

AI resume analysis

Candidate ranking

Candidate filtering

Application pipeline

Application status management

Email notifications

Protected frontend routes

🔮 Future Improvements

Possible future enhancements include:

AWS S3 resume storage

Advanced recruiter analytics

Interview scheduling

Calendar integration

Bulk candidate management

Advanced AI recommendations

Resume version management

Production deployment

Automated testing

CI/CD pipeline

More granular recruiter permissions

👨‍💻 Author

Rammi Nandanwar

GitHub:

https://github.com/RammiNandanwar