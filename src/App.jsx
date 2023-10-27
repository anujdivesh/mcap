import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/about';
import SignUp from './pages/signup';
import Home from './pages/home';


function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
    <Route path='/mcap/home' element={<SignUp/>} />
      <Route exact path='/mcap/explorer' element={<About/>} />
      <Route path='/mcap/reports' element={<Home/>} />
      <Route path="/mcap" element={<Navigate replace to="/mcap/home" />} />
      <Route path="/" element={<Navigate replace to="/mcap/home" />} />
    </Routes>
  </Router>
  );
}

export default App;
