let acrossClues = [];
let downClues = [];
let rows = 0;
let cols = 0;

function playGame(grid, acrossCluesOrig, downCluesOrig) {
	acrossClues = acrossCluesOrig;
	downClues = downCluesOrig;

	$('.waiting-for-opponent-container').css('display', 'none');
	$('.crossword-loading-anim-container').css('display', 'none');
	$('.crossword-container').css('display', 'flex');

	rows = grid.length;
	cols = grid[0].length;

	let cellNum = 1;

	let crossword = $('.crossword');

	for (let i = 0; i < rows; i++) {
		let row = $('<div class="crossword-row"></div>');

		for (let j = 0; j < cols; j++) {
			let cell = $('<div class="crossword-cell"></div>');

			if (grid[i][j] === '') {
				cell.addClass('crossword-cell-black');
			}

			if (i == 0 || j == 0) {
				let cellNumEl = $('<div class="crossword-cell-num"></div>');
				cellNumEl.text(cellNum);
				cell.append(cellNumEl);
				cellNum++;
			}

			let cellValue = $('<div class="crossword-cell-value"></div>');
			cell.append(cellValue);

			row.append(cell);
		}

		crossword.append(row);
	}

	for (let i = 0; i < acrossClues.length; i++) {
		let acrossNum = $('.crossword-row').eq(i).find('.crossword-cell-num')[0].textContent;
		let num = $(`<h3>${acrossNum}.</h3>`);
		let clue = $('<div class="clues-clue"></div>');
		clue.text(acrossClues[i]);
		let clueContainer = $('<div class="clues-clue-container"></div>');
		clueContainer.append(num);
		clueContainer.append(clue);
		$('.clues-container-across').append(clueContainer);
	}

	for (let i = 0; i < downClues.length; i++) {
		let downNum = $('.crossword-row').eq(0).find('.crossword-cell-num').eq(i)[0].textContent;
		let num = $(`<h3>${downNum}.</h3>`);
		let clue = $('<div class="clues-clue"></div>');
		clue.text(downClues[i]);
		let clueContainer = $('<div class="clues-clue-container"></div>');
		clueContainer.append(num);
		clueContainer.append(clue);
		$('.clues-container-down').append(clueContainer);
	}

	createKeyboard();

	selectCell(0, 0, 'across');

	$('.crossword-cell').on('click tap', function (e) {
		e.preventDefault();
		e.stopPropagation();

		let selectedCell = $('.crossword-cell-selected');
		let isAcross = selectedCell.next().hasClass('crossword-cell-selected-secondary') || selectedCell.prev().hasClass('crossword-cell-selected-secondary');

		if ($(this).hasClass('crossword-cell-selected')) {
			isAcross = !isAcross;
		}

		let direction = isAcross ? 'across' : 'down';

		selectCell($(this).parent().index(), $(this).index(), direction);
	});

	$('.clues-previous').on('click tap', previousClue.bind(null));

	$('.clues-next').on('click tap', nextClue.bind(null));

	$(window).on('keydown', function (e) {
		// 9: tab
		if (e.which === 9) {
			if (e.shiftKey) {
				previousClue(e);
			} else {
				nextClue(e);
			}
		}
	});

	$('.clues-clue-container').on('click tap', function (e) {
		e.preventDefault();
		e.stopPropagation();

		let index = $(this).index();
		let direction = $(this).parent().hasClass('clues-container-across') ? 'across' : 'down';
		let row = 0;
		let col = 0;

		if (direction === 'across') {
			row = index - 1;
		} else {
			col = index - 1;
		}

		selectCell(row, col, direction);
	});
}

function previousClue(e) {
	e.preventDefault();
	e.stopPropagation();

	let currentRow = $('.crossword-cell-selected').parent().index();
	let currentCol = $('.crossword-cell-selected').index();
	let direction = $('.crossword-cell-selected').prev().hasClass('crossword-cell-selected-secondary') || $('.crossword-cell-selected').next().hasClass('crossword-cell-selected-secondary') ? 'across' : 'down';

	if (direction == 'across') {
		currentRow--;
		currentCol = 0;
	} else {
		currentRow = 0;
		currentCol--;
	}

	if (currentRow < 0) {
		currentRow = 0;
		currentCol = downClues.length - 1;
		direction = 'down';
	} else if (currentCol < 0) {
		currentRow = acrossClues.length - 1;
		currentCol = 0;
		direction = 'across';
	}

	let cell = $('.crossword-row').eq(currentRow).find('.crossword-cell').eq(currentCol);
	while (cell.children('.crossword-cell-value').text() !== '') {
		if (direction === 'across') {
			currentCol++;

			if (currentCol >= cols) {
				currentCol = cols - 1;
				break;
			}
		} else {
			currentRow++;

			if (currentRow >= rows) {
				currentRow = rows - 1;
				break;
			}
		}
		cell = $('.crossword-row').eq(currentRow).find('.crossword-cell').eq(currentCol);
	}

	selectCell(currentRow, currentCol, direction);
}

function nextClue(e) {
	e.preventDefault();
	e.stopPropagation();

	let currentRow = $('.crossword-cell-selected').parent().index();
	let currentCol = $('.crossword-cell-selected').index();
	let direction = $('.crossword-cell-selected').prev().hasClass('crossword-cell-selected-secondary') || $('.crossword-cell-selected').next().hasClass('crossword-cell-selected-secondary') ? 'across' : 'down';

	if (direction == 'across') {
		currentRow++;
		currentCol = 0;
	} else {
		currentRow = 0;
		currentCol++;
	}

	if (currentRow >= acrossClues.length) {
		currentRow = 0;
		currentCol = 0;
		direction = 'down';
	} else if (currentCol >= downClues.length) {
		currentRow = 0;
		currentCol = 0;
		direction = 'across';
	}

	let cell = $('.crossword-row').eq(currentRow).find('.crossword-cell').eq(currentCol);
	while (cell.children('.crossword-cell-value').text() !== '') {
		if (direction === 'across') {
			currentCol++;

			if (currentCol >= cols) {
				currentCol = cols - 1;
				break;
			}
		} else {
			currentRow++;

			if (currentRow >= rows) {
				currentRow = rows - 1;
				break;
			}
		}
		cell = $('.crossword-row').eq(currentRow).find('.crossword-cell').eq(currentCol);
	}

	selectCell(currentRow, currentCol, direction);
}

function selectCell(row, col, direction) {
	$('.crossword-cell').removeClass('crossword-cell-selected crossword-cell-selected-secondary');

	let cell = $('.crossword-row').eq(row).find('.crossword-cell').eq(col);
	cell.addClass('crossword-cell-selected');

	if (direction === 'across') {
		let rowCells = $('.crossword-row').eq(row).find('.crossword-cell');
		rowCells.addClass('crossword-cell-selected-secondary');
	} else {
		let colCells = $('.crossword-cell').filter(function () {
			return $(this).index() == col;
		});
		colCells.addClass('crossword-cell-selected-secondary');
	}

	let firstCell = $('.crossword-cell-selected-secondary').eq(0);
	displayClue(firstCell.parent().index(), firstCell.index(), direction);

	if (direction == 'across') {
		let index = firstCell.parent().index() + 1;
		$('.clues-container-across').children().removeClass('clues-clue-selected');
		$('.clues-container-down').children().removeClass('clues-clue-selected');
		$('.clues-container-across').children().eq(index).addClass('clues-clue-selected');
	} else {
		let index = firstCell.index() + 1;
		$('.clues-container-down').children().removeClass('clues-clue-selected');
		$('.clues-container-across').children().removeClass('clues-clue-selected');
		$('.clues-container-down').children().eq(index).addClass('clues-clue-selected');
	}
}

function displayClue(row, col, direction) {
	let clue = direction === 'across' ? acrossClues[row] : downClues[col];
	$('.clues-current').text(clue);
}

function isFilled() {
	let filled = true;
	for (let i = 0; i < $('.crossword-row').length; i++) {
		for (let j = 0; j < $('.crossword-row').eq(i).find('.crossword-cell').length; j++) {
			if ($('.crossword-row').eq(i).find('.crossword-cell').eq(j).children('.crossword-cell-value').text() === '') {
				filled = false;
				break;
			}
		}
	}

	return filled;
}
