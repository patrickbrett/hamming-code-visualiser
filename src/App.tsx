import React from 'react';
import './App.css';
import BitMatrix, { CodeType, ColourCode } from './lib/BitMatrix';

const bm = new BitMatrix(CodeType.HAMMING, "R W HAMMING", ColourCode.BLUE);

function App() {
  return (
    <div className="App">
    </div>
  );
}

export default App;
