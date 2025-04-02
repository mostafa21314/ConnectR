import React from 'react';
import "tailwindcss" 
import Login from "./Authentication/Login.jsx";
import Register from "./Authentication/Register.jsx";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <div className="flex justify-center items-center h-screen">
              <nav className="space-x-4">
                <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                <Link to="/register" className="text-green-500 hover:underline">Register</Link>
              </nav>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;