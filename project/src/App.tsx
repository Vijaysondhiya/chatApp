import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import OpenAccount from './pages/OpenAccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/open-account" element={<OpenAccount />} />
    </Routes>
  );
}

export default App;