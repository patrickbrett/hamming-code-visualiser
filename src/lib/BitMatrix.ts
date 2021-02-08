import { BITS_PER_CHAR, BIT_MATRIX_HEIGHT, BIT_MATRIX_WIDTH } from "./consts";

export enum CodeType {
	NONE = 0,
	HAMMING_NO_CORRECTION = 1,
	HAMMING = 2,
}

export enum ColourCode {
	BLACK = 0,
	RED = 1,
	GREEN = 2,
	BLUE = 3,
}

interface IMatrix {}

interface IBitMatrix {}

class Matrix implements IMatrix {
	private matrixArray: boolean[][];

	constructor(width: number, height: number) {
    this.matrixArray = new Array(height).fill(false).map(() => new Array(width).fill(false));
  }

  public getMatrixArray() {
    return this.matrixArray;
  }
  
  setCellAtIndex(index: number, value: boolean) {
    const x = index % BIT_MATRIX_WIDTH;
    const y = Math.floor(index / BIT_MATRIX_HEIGHT);
    console.log('setting', x, y, index, BIT_MATRIX_WIDTH, BIT_MATRIX_HEIGHT);
    this.setCell(x, y, value);
  }

  getCellAtIndex(index: number) {
    const x = index % BIT_MATRIX_WIDTH;
    const y = Math.floor(index / BIT_MATRIX_HEIGHT);
    return this.getCell(x, y);
  }

	setCell(x: number, y: number, value: boolean) {
    console.log('sc', x, y, value);
    this.matrixArray[y][x] = value;
  }

	getCell(x: number, y: number) {
    return this.matrixArray[y][x];
  }

  flipCellAtIndex(index: number) {
    const currentValue = this.getCellAtIndex(index);
    const newValue = !currentValue;
    this.setCellAtIndex(index, newValue);
  }
}

export default class BitMatrix implements IBitMatrix {
	private codeType: CodeType;
	private matrix: Matrix;

	constructor(codeType: CodeType, text: string, colourCode: ColourCode) {
    this.matrix = new Matrix(BIT_MATRIX_WIDTH, BIT_MATRIX_HEIGHT);

    this.codeType = codeType;

    this.fillMatrix(text, colourCode);
    this.calculateCodes();
  }

  public getMatrix() {
    return this.matrix;
  }

  private leftPadBinaryArray(array: boolean[], length: number) {
    const padding = new Array(length).fill(false);
    return padding.concat(array);
  }

  private colourCodeToBinaryArray(colourCode: ColourCode): boolean[] {
    const msb = Boolean(Math.floor(colourCode.valueOf() / 2))
    const lsb = Boolean(colourCode.valueOf() % 2);

    return [msb, lsb];
  }

  private numToBinaryArray(num: number): boolean[] {
    if (num === 0) {
      return this.leftPadBinaryArray([], BITS_PER_CHAR);
    }

    let numMutable = num;

    const binArray = new Array(BITS_PER_CHAR).fill(false).map((val, i) => {
      const powerOf2 = Math.pow(2, BITS_PER_CHAR - i - 1);

      if (powerOf2 <= numMutable) {
        numMutable -= powerOf2;
        return true;
      }

      return false;
    });

    return binArray;
  }

  private letterToNum(letter: string): number {
    const allowedChars = /[A-Z ,.!?']/;

    if (letter.length !== 1) {
      throw new Error("Letter must be a string of length 1");
    }

    if (!letter.match(allowedChars)) {
      throw new Error(`Letter contains a forbidden character: ${letter}`);
    }

    switch (letter) {
      case " ": return 0;
      case ",": return 27;
      case ".": return 28;
      case "?": return 29;
      case "!": return 30;
      case "'": return 31;
      default: return letter.charCodeAt(0) - 64; // Uppercase letter
    }
  }

  private fillMatrix(text: string, colourCode: ColourCode) {
    let rawBinArray: boolean[] = [];

    for (const letter of text) {
      const num = this.letterToNum(letter);
      const binArray = this.numToBinaryArray(num);
      console.log(letter, num, binArray);

      rawBinArray = rawBinArray.concat(binArray);
    }

    // Add colour code
    rawBinArray = rawBinArray.concat(this.colourCodeToBinaryArray(colourCode));

    let rawIndex = 0;

    console.log('rbal', rawBinArray.length, text.length);

    // Encode data
    for (let i=0; rawIndex < rawBinArray.length; i++) {
      console.log(i, rawIndex);

      if (i === 0 || Math.log2(i) % 1 === 0) { // Reserved for hamming bits
        continue;
      }

      this.matrix.setCellAtIndex(i, rawBinArray[rawIndex]);
      rawIndex++;
    }

    console.log(this.matrix);
  }

  private calculateCodes() {
    const bitMatrixSize = BIT_MATRIX_HEIGHT * BIT_MATRIX_WIDTH;

    // Calculate main codes
    for (let i=1; i<bitMatrixSize; i *= 2) {
      for (let j=1; j<bitMatrixSize; j++) {
        if (i !== j && i & j && this.matrix.getCellAtIndex(j)) {
          console.log('gci', i, j, this.matrix.getCellAtIndex(j));
          console.log('flipping at ' + i);
          this.matrix.flipCellAtIndex(i);
          console.log(j, this.matrix.getCellAtIndex(i));
        }
      }
    }

    // Calculate final parity code
    for (let j=1; j<bitMatrixSize; j++) {
      if (this.matrix.getCellAtIndex(j)) {
        this.matrix.flipCellAtIndex(0);
      }
    }

    console.log(this.matrix);
  }
}
