let boardDiv = document.getElementById("board");
const solveBtn = document.getElementById("solve");
const numSquares = 81;
const solve = document.getElementById("solve");
const generateBtn = document.getElementById("generate");

function createBoard(board) {
	boardDiv.innerHTML = "";
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			const square = document.createElement("input");
			square.className = "number";
			square.id = `${i}-${j}`;
			square.setAttribute("type", "number");
			square.setAttribute("min", "1");
			square.setAttribute("max", "9");
			square.setAttribute("class", "square");
			square.maxLength = 1;
			if (board[i][j] !== 0) {
				square.classList.add("starting");
				square.value = board[i][j];
				square.disabled = true;
			}
			if (i == 2 || i == 5) {
				square.classList.add("bottom-border");
			}
			if (j == 2 || j == 5) {
				square.classList.add("right-border");
			}
			square.onkeyup = function (e) {
				if (this.value > 9 || this.value < 1) this.value = "";
				if (e.key == "Backspace") {
					this.previousElementSibling.focus();
				}
			};
			boardDiv.appendChild(square);
		}
	}
}

solveBtn.addEventListener("click", () => {
	let boardArray = [];
	for (let i = 0; i < 9; i++) {
		let row = [];
		for (let j = 0; j < 9; j++) {
			let square = document.getElementById(`${i}-${j}`);
			if (square.value == "") {
				row.push(0);
			} else {
				row.push(parseInt(square.value));
			}
		}
		boardArray.push(row);
	}
	console.log(boardArray);
	solveBoard(boardArray);
});

generateBtn.addEventListener("click", () => {
	const data = null;

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			generated = JSON.parse(this.responseText).puzzle;
			console.log(generated);
			createBoard(makeBoard(generated));
			console.log(makeBoard(generated));
		}
	});
	xhr.open("GET", "/board");
	xhr.send(data);
});

function makeBoard(puzzle) {
	newBoard = [];

	for (let i = 0; i < 9; i++) {
		let row = [];
		for (let j = 0; j < 9; j++) {
			row.push(puzzle[i * 9 + j]);
			if (row[j] == ".") row[j] = 0;
			row[j] = parseInt(row[j]);
		}
		newBoard.push(row);
	}
	return newBoard;
}

generated =
	"0000000000000000000000000000000000000000000000000000000000000000000000000000000000";

createBoard(makeBoard(generated));

function checkValid(board, row, col) {
	return (
		checkRow(board, row, col) &&
		checkCol(board, row, col) &&
		checkBox(board, row, col)
	);
}

function checkRow(board, row, col) {
	for (let i = 0; i < board.length; i++) {
		if (i == col) continue;
		if (board[row][i] == board[row][col]) {
			return false;
		}
	}
	return true;
}

function checkCol(board, row, col) {
	for (let i = 0; i < board.length; i++) {
		if (i == row) continue;
		if (board[i][col] == board[row][col]) return false;
	}
	return true;
}

function checkBox(board, row, col) {
	let boxRow = Math.floor(row / 3) * 3;
	let boxCol = Math.floor(col / 3) * 3;
	for (let i = boxRow; i < boxRow + 3; i++) {
		for (let j = boxCol; j < boxCol + 3; j++) {
			if (i == row && j == col) continue;
			if (board[i][j] == board[row][col]) return false;
		}
	}
	return true;
}

function solveBoard(board) {
	// await sleep(100);
	let empty = findEmpty(board);
	if (!empty) return true;
	let row = empty[0];
	let col = empty[1];
	for (let i = 1; i < 10; i++) {
		document.getElementById(`${row}-${col}`).classList.add("active");
		document.getElementById(`${row}-${col}`).value = i;
		board[row][col] = i;
		if (checkValid(board, row, col)) {
			if (solveBoard(board)) {
				return true;
			}
		}
		board[row][col] = 0;
	}
	return false;
}

// function sleep(ms = 100) {
// 	return new Promise((resolve) => setTimeout(resolve, ms));
// }

function findEmpty(board) {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (board[i][j] == 0) {
				return [i, j];
			}
		}
	}
	return null;
}
