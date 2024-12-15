import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './ui/Home';
import DataAnalysis from './components/DataAnalysis';
import MergedData from './components/MergedData';
import FetchUniqueValue from './components/FetchUniqueValue';
import Selection from './components/Selection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
        <Route path="/merged-data" element={<MergedData />} />
        <Route path="/fetch-unique-value" element={<FetchUniqueValue />} />
        <Route path="/selection" element={<Selection />} />
      </Routes>
    </Router>
  );
}

export default App;
