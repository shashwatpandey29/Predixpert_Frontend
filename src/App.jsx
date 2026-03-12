import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DiabetesModule from './pages/DiabetesModule';
import CancerModule from './pages/CancerModule';
import PrognosisModule from './pages/PrognosisModule';
import HeartDiseaseModule from './pages/HeartDiseaseModule';
import StockModule from './pages/StockModule';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diabetes" element={<DiabetesModule />} />
        <Route path="/cancer" element={<CancerModule />} />
        <Route path="/prognosis" element={<PrognosisModule />} />
        <Route path="/heart-disease" element={<HeartDiseaseModule />} />
        <Route path="/stock-predictor" element={<StockModule />} />
      </Routes>
    </div>
  );
}

export default App;