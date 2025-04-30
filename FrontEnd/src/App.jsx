import React from 'react';
import "tailwindcss" 
import Login from "./Authentication/Login.jsx";
import Register from "./Authentication/Register.jsx";
import HomePage from './Menus/HomePage.jsx';
import Dashboard from './Menus/HRDashboard.jsx';
import ResumeParser from './Menus/ResumeParsing.jsx';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/dashboard/resume-parser" element={<ResumeParser />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;