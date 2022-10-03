/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
const htmlBoard = document.getElementById("board");
let won = false;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	for (let y = 0; y < HEIGHT; y++) {
		let newRow = [];
		for (let x = 0; x < WIDTH; x++) {
			newRow.push(null);
		}
		board.push(newRow);
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	// ?? But isn't that already done by targeting htmlBoard in the DOM, like at the bottom and middle of this function?

	// Creating and setting top row as event listener to add connect 4 pieces
	const top = document.createElement("tr");
	top.setAttribute("id", "column-top");
	top.addEventListener("click", handleClick);

	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement("td");
		headCell.setAttribute("id", x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Creating display cells for the gameboard with tables and rows, giving each vell an ID
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement("tr");
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement("td");
			cell.setAttribute("id", `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	for (let i = HEIGHT - 1; i >= 0; i--) {
		if (board[i][x] === null) {
			return i;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	let newPiece = document.createElement("div");
	newPiece.setAttribute("class", `p${currPlayer} piece`);
	let playedCell = document.getElementById(`${y}-${x}`);
	playedCell.append(newPiece);
	board[y][x] = currPlayer;
}

/** endGame: announce game end */

function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// Just added this code for funsies
	if (won === true) {
		return;
	}

	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		won = true;
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	if (checkForTie()) {
		return endGame("Tie!");
	}

	// switch players
	if (currPlayer === 1) {
		currPlayer++;
	} else {
		currPlayer--;
	}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForTie() {
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			if (board[y][x] === null) {
				return false;
			}
		}
	}
	return true;
}

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.
	// Check through each 4 vertical, horizontal, and diagonal cells, and if they are all legal and all contain currPlayer's value, then run the win function
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			const horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3],
			];
			const vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x],
			];
			const diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3],
			];
			const diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3],
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
