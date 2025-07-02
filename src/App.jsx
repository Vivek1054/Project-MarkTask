import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import MarkTask from './components/MarkTask';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/MarkTask" element={<MarkTask />} />
      </Routes>
    </Router>
  );
}

export default App;
