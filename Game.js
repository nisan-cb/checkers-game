import Group from "./Group.js";
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
        this.insertIntoMatrix(this.blackGroup);
        this.insertIntoMatrix(this.redGroup);
        this.addClickEventToCells();
        this.display();
    }
    insertIntoMatrix(group) {
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
                this.table.rows[i].cells[j].addEventListener('click', () => { this.clickOnCellkHandler(i, j) });
    }
    clickOnCellkHandler(i, j) {
        const piece = this.matrix[i][j];
        this.cleanSteps(this.currentPiece);

        this.currentPiece = piece;
        if (piece) {
            piece.calcValidSteps(this.matrix);
            this.displayValidSteps(piece);
        }
    }
    displayValidSteps(piece) {
        if (!piece) return;
        for (const step of piece.validSteps) {
            this.table.rows[step[0]].cells[step[1]].classList.add('step');
        }
    }
    cleanSteps(piece) {
        if (!piece) return;
        for (const step of piece.validSteps) {
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
        }
    }


}

export default Game;