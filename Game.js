// import Group from "./Group.js";
const RED = 'red';
const BLACK = 'black';

class Game {
    constructor(tableElement, rows, cols) {
        this.table = tableElement;
        this.matrix = Array(rows).fill().map(() => Array(cols).fill());
        this.redGroup = new Group(RED);
        this.blackGroup = new Group(BLACK);
        this.currentPiece = undefined;
    }

    start() {
        console.log('start')
        // this.blackGroup.piecesList[0].setPosition(3, 3);
        // this.blackGroup.piecesList[1].setPosition(3, 3);
        // this.blackGroup.piecesList[10].setPosition(3, 3);
        // this.blackGroup.piecesList[4].setPosition(5, 1);
        // this.redGroup.piecesList[5].setPosition(5, 1);
        this.insertGroupIntoMatrix(this.blackGroup);
        this.insertGroupIntoMatrix(this.redGroup);
        this.addClickEventToCells();

        this.display();
    }
    insertGroupIntoMatrix(group) {
        for (let piece of group.piecesList)
            this.matrix[piece.r][piece.c] = piece
    }
    display() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.table.rows[i].cells[j].innerHTML = '';
                if (this.matrix[i][j])
                    this.table.rows[i].cells[j].appendChild(this.matrix[i][j].el);
            }
        }
    }

    addClickEventToCells() {
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++)
                this.table.rows[i].cells[j].addEventListener('click', (e) => { this.clickOnCellkHandler(e, i, j) });
    }

    clickOnCellkHandler(e, i, j) {
        const cellData = this.matrix[i][j];
        let result = this.isValidMove(i, j);
        console.log(result)
        if (result) {
            console.log('in')
            this.makeMove(this.currentPiece, i, j);
            this.cleanSteps(this.currentPiece);
            this.currentPiece = undefined;
        } else if (cellData) {
            this.currentPiece = cellData;
            this.currentPiece.calcValidSteps(this.matrix);
            this.displayValidSteps(this.currentPiece);
        }

    }
    isValidMove(i, j) {
        if (!this.currentPiece) return false;
        for (let step of this.currentPiece.validSteps) {
            if (i === step[0] && j === step[1])
                return true;
        }
        this.cleanSteps(this.currentPiece);
        this.currentPiece = undefined;
        return false;
    }
    displayValidSteps(piece) {
        if (!piece) return;
        for (const step of piece.validSteps) {
            console.log(step)
            this.table.rows[step[0]].cells[step[1]].classList.add('step');
        }
    }

    cleanSteps(piece) {
        if (!piece) return;
        for (const step of piece.validSteps) {
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
            this.matrix[step[0]][step[1]] = undefined;
        }
    }
    makeMove(piece, i, j) {
        console.log([i, j])
        const validMove = this.matrix[i][j];
        console.log(validMove)
        if (validMove['from'] === undefined) return;

        console.log([validMove.from.cell[0], validMove.from.cell[1]])
        this.makeMove(piece, validMove.from.cell[0], validMove.from.cell[1]);

        setTimeout(() => {
            this.table.rows[piece.r].cells[piece.c].innerHTML = '';
            this.matrix[piece.r][piece.c] = undefined;

            if (i - piece.r !== 1 && i - piece.r !== -1)
                this.removePieceByCellIndex((i + piece.r) / 2, (j + piece.c) / 2);

            piece.el.classList.add('move');
            this.table.rows[i].cells[j].appendChild(piece.el);
            this.matrix[i][j] = piece;
            piece.setPosition(i, j)
        }, validMove['delay'] * 90);

    }

    removePieceByCellIndex(i, j) {
        console.log([i, j])
        this.table.rows[i].cells[j].innerHTML = '';
        this.matrix[i][j] = undefined;
    }


}

// export default Game;