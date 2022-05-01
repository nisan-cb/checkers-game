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
        this.cleanSteps(this.currentPiece);
        let result = this.isValidMove(i, j);
        console.log(result)
        if (result) {
            console.log('in')
            this.cleanSteps(this.currentPiece);
            this.makeMove(this.currentPiece, result);
            this.currentPiece = undefined;
        } else if (cellData) {
            this.currentPiece = cellData;
            this.currentPiece.calcValidSteps(this.matrix);
            this.displayValidSteps(this.currentPiece);
        }
    }
    isValidMove(i, j) {
        if (!this.currentPiece) return undefined;
        for (let validMove of this.currentPiece.validSteps) {
            const step = validMove['cell'];
            if (i === step[0] && j === step[1] && validMove['from'] !== undefined)
                return validMove;
        }
        this.currentPiece = undefined;
        return undefined;
    }
    displayValidSteps(piece) {
        if (!piece) return;
        for (const validMove of piece.validSteps) {
            const step = validMove['cell'];
            this.table.rows[step[0]].cells[step[1]].classList.add('step');
        }
    }

    cleanSteps(piece) {
        if (!piece) return;
        for (const validMove of piece.validSteps) {
            const step = validMove['cell'];
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
            this.matrix[step[0]][step[1]] = undefined;
        }
    }
    makeMove(piece, validMove) {
        if (validMove['from'] === undefined) return;
        console.log('validMove=', validMove);

        this.makeMove(piece, validMove['from']);

        setTimeout(() => {
            const new_r = validMove['cell'][0];
            const new_c = validMove['cell'][1];

            this.table.rows[piece.r].cells[piece.c].innerHTML = '';
            this.matrix[piece.r][piece.c] = undefined;

            console.log([new_r, piece.r, new_c, piece.c])
            if (new_r - piece.r !== 1 && new_r - piece.r !== -1)
                this.removePieceByCellIndex((new_r + piece.r) / 2, (new_c + piece.c) / 2);

            piece.el.classList.add('move');
            this.table.rows[new_r].cells[new_c].appendChild(piece.el);
            console.log([new_r, new_c]);
            this.matrix[new_r][new_c] = piece;
            piece.setPosition(new_r, new_c)
        }, validMove['delay'] * 90);

    }

    removePieceByCellIndex(i, j) {
        console.log([i, j])
        this.table.rows[i].cells[j].innerHTML = '';
        this.matrix[i][j] = undefined;
    }


}

// export default Game;