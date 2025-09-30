# Full-Stack Note-Taking Application

A modern, responsive note-taking application built with MERN stack, featuring user authentication, Google OAuth integration, and JWT authorization.

## 📋 Features

- **User Authentication**: Sign up and login with email/OTP or Google account
- **Note Management**: Create, view, and delete notes
- **Secure Authorization**: JWT-based authentication for protected routes
- **Responsive Design**: Mobile-friendly interface
- **Input Validation**: Comprehensive form validation with error handling
- **Welcome Dashboard**: Personalized user experience with profile information 

## 🚀 Technology Stack

### Frontend
- **ReactJS**
- **Tailwind** CSS for responsive design

### Backend
- **Node.js** 
- Express.js framework 
- JWT for authentication
- Google OAuth integration
- Email/OTP service integration

### Database
- **MongoDB** 

### Version Control
- **Git** 

# Live Demo

Try the live version of the project here:

🔗 **Live Demo:** https://noteapp-gozu.onrender.com

## 📦 Installation & Setup

### Prerequisites
- Node.js (latest LTS version)
- npm or yarn package manager
- Database (MongoDB)
- Git

### Clone the Repository
```bash
git clone https://github.com/ShivendraPratap20/noteApp.git
cd noteApp
```

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DB_CONN_URI=<your-database-connection-string>
SECRET_KEY=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
EMAIL_USER=<your-email-for-otp-sending>
EMAIL_PASS=<your-email-service-key>
CLIENT_URL=<client-url-oauth>
```

Start the backend server:
```bash
cd ./backend
npm start
```

### Frontend Setup
```bash
cd ./frontend
npm install
```



Start the frontend development server:
```bash
npm run dev
```

## 🛠️ Development Workflow

### Project Structure
```
noteApp/
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   └── components/
|   |       ├──dashboard
|   |       └──user
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── db/
|   |   |   └──model
|   |   ├──middleware
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
└── README.md
```

### Key Components to Implement

1. **Authentication System**
   - Email/OTP signup and login
   - Google OAuth integration
   - JWT token management
   - Input validation and error handling

2. **Notes Management**
   - Create new notes
   - Display user notes
   - Delete existing notes

3. **User Interface**
   - Welcome/Dashboard page
   - User profile display
   - Mobile-responsive design
   - Error message handling

## 🔐 Authentication Flow

1. **Signup Options**:
   - Email + OTP verification
   - Google OAuth signup

2. **Login Options**:
   - Email + Password
   - Google OAuth login

3. **Authorization**:
   - JWT tokens for API access
   - Protected routes for authenticated users

## 🎯 Key Requirements

- [ ] Email/OTP and Google OAuth authentication
- [ ] Comprehensive input validation
- [ ] Error handling for all failure scenarios
- [ ] Welcome page with user information
- [ ] Note creation and deletion functionality
- [ ] Mobile-friendly responsive design
- [ ] Deployment-ready configuration

## 📝 API Endpoints

### Authentication
- `GET  /verify`            - User authentication using JWT
- `POST /signup`            - User registration with email
- `POST /verifyotp`         - OTP verification
- `POST /signin`            - User login
- `POST /resend-otp`        - OTP resend
- `POST /auth/google`       - Google OAuth authentication

### Notes
- `GET /notes`      - Get user notes (Protected)
- `POST /notes`     - Create new note (Protected)
- `DELETE /notes`  - Delete note (Protected)

### User
- `GET /verify` - Verify and get user information (Protected)
- `GET /update` - Update user information
- `GET /logout` - Logout user

## 🚀 Deployment

### Environment Setup
1. Set up environment variables for production
2. Configure database connection for production
3. Update CORS settings for production domain

### Deployment Platforms
- **Frontend and Backend**: Render
- **Database**: MongoDB Atlas

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Build process optimized
- [ ] HTTPS enabled
- [ ] Error logging implemented
- [ ] Performance monitoring set up

```
For any questions or issues, please contact:
- **Developer**: Shivendra Pratap
- **Email**: shivendragkp2002@gmail.com

**Note**: This project is part of a full-stack development assessment. Ensure all requirements are met before final submission and deployment.
```
