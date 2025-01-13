// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Submissions from './components/Submissions';
import SubmitExperience from './components/SubmitExperience';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/submit-experience" element={<SubmitExperience />} />
      </Routes>
    </Router>
  );
};

export default App;
