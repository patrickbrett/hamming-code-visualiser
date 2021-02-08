import React from 'react';
import './App.css';
import BitMatrix, { CodeType, ColourCode } from './lib/BitMatrix';
import clsx from 'clsx';
import { BIT_MATRIX_WIDTH } from './lib/consts';

const bitMatrix = new BitMatrix(CodeType.HAMMING, 'R W HAMMING', ColourCode.BLUE);

const isHamming = (i: number, j: number): boolean => {
	const index = j * BIT_MATRIX_WIDTH + i;
	return Math.log2(index) % 1 === 0;
};

function App() {
	return (
		<div className="App">
			<div className="matrix">
				{bitMatrix
					.getMatrix()
					.getMatrixArray()
					.map((row, i) => (
						<div className="row" key={i}>
							{row.map((cell, j) => (
								<div className={clsx('cell', cell && 'active', isHamming(i, j) && 'hamming')} key={j}>
									{bitMatrix.charAtPosition(j, i)}
								</div>
							))}
						</div>
					))}
			</div>
		</div>
	);
}

export default App;
