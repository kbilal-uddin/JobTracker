import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import JobApplications from './JobApplications.jsx'
import InterviewSchedule from './InterviewSchedule.jsx'
import NewJobApplication from './NewJobApplication.jsx'
import Statistics from './Statistics.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/" element={<JobApplications />} />
            <Route path="/apply" element={<NewJobApplication />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/schedule-interview/:jobApplicationID" element={<InterviewSchedule />} />
        </Routes>
    </Router>,
)
