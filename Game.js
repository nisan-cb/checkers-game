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
        this.currentGrup = this.redGroup;
        this.undoVector = [];
        this.lastMove = {};
    }

    start() {
        console.log('start')

        // this.redGroup.piecesList[0].setPosition(0, 0);
        // this.redGroup.piecesList[2].setPosition(4, 2);
        // this.redGroup.piecesList[3].setPosition(4, 2);
        // this.blackGroup.piecesList[3].setPosition(3, 3);
        // this.blackGroup.piecesList[1].setPosition(3, 5);

        this.insertGroupIntoMatrix(this.blackGroup);
        this.insertGroupIntoMatrix(this.redGroup);
        this.addClickEventToCells();
        this.addElements();

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
        if (this.isValidMove(i, j)) {

            this.lastMove = {
                'piece': this.currentPiece,
                'source': [this.currentPiece.r, this.currentPiece.c],
                'killed': []
            };
            this.undoVector.push(this.lastMove)
            this.makeMove(this.currentPiece, i, j, this.matrix[i][j].length);
            // this.switchTurn();
            this.cleanSteps(this.currentPiece);
            this.currentPiece = undefined;
        } else if (cellData) {
            if (cellData.color !== this.currentGrup.color) return;
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
        for (const step of piece.validSteps)
            this.table.rows[step[0]].cells[step[1]].classList.add('step');
        this.table.rows[piece.r].cells[piece.c].classList.add('selected');
    }

    cleanSteps(piece) {
        if (!piece) return;
        for (const step of piece.validSteps) {
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
            this.matrix[step[0]][step[1]] = undefined;
        }
        this.table.rows[piece.r].cells[piece.c].classList.remove('selected');

    }
    makeMove(piece, i, j, length) {
        const validMove = this.matrix[i][j];
        if (validMove['from'] === undefined) return;

        this.makeMove(piece, validMove.from.cell[0], validMove.from.cell[1], length);

        setTimeout(() => {
            if (i - piece.r !== 1 && i - piece.r !== -1) {
                this.lastMove.killed.push(this.matrix[(i + piece.r) / 2][(j + piece.c) / 2]);
                this.removePieceByCellIndex((i + piece.r) / 2, (j + piece.c) / 2);
            }


            piece.el.classList.add('move');
            this.matrix[piece.r][piece.c] = undefined;
            this.matrix[i][j] = piece;
            piece.setPosition(i, j)
            this.table.rows[i].cells[j].appendChild(piece.el);

            if (validMove.length === length) {
                piece.el.classList.remove('move');
                this.switchTurn();
            }
        }, validMove['delay'] * 90);

    }
    replace(piece, i, j) {
        this.table.rows[i].cells[j].appendChild(piece.el);
    }

    removePieceByCellIndex(i, j) {
        this.table.rows[i].cells[j].innerHTML = '';
        this.matrix[i][j].remove(this.getGroupByColor(this.matrix[i][j].color));
        this.matrix[i][j] = undefined;
    }


    switchTurn() {
        document.getElementById(`${this.currentGrup.color}-turn`).classList.remove('turn');
        this.currentGrup = this.getOpponentGroup();
        document.getElementById(`${this.currentGrup.color}-turn`).classList.add('turn');
        if (this.currentGrup.piecesList.length === 0)
            this.popUpMessage(`${this.getOpponentGroup().color} wins !`)
        else if (this.isDeadlock())
            this.popUpMessage('DeadLock !');
    }

    getOpponentGroup(color = this.currentGrup.color) {
        if (color === RED)
            return this.blackGroup;
        return this.redGroup;
    }
    getGroupByColor(color) {
        if (color === RED)
            return this.redGroup;
        return this.blackGroup;
    }
    isDeadlock() {
        for (const piece of this.currentGrup.piecesList) {
            piece.calcValidSteps(this.matrix);
            if (piece.validSteps.length > 0) {
                this.cleanSteps(piece)
                return false;
            }
        }

        return true;
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    addElements() {
        document.getElementById('btns-area').style.display = 'flex';
        document.getElementById('turn-switch').style.display = 'block';
        let undoBtn = document.getElementById('unDoBtn');
        undoBtn.addEventListener('click', () => { this.unDoLastMove() });
    }

    unDoLastMove() {
        const lastMove = this.undoVector.pop();
        if (!lastMove) return;
        const piece = lastMove.piece;
        this.matrix[piece.r][piece.c] = undefined;
        this.matrix[lastMove.source[0]][lastMove.source[1]] = lastMove.piece;
        piece.setPosition(lastMove.source[0], lastMove.source[1]);
        for (const killed of lastMove.killed) {
            this.matrix[killed.r][killed.c] = killed;
            this.getGroupByColor(killed.color).insertPiece(killed);
        }
        this.display();
        this.switchTurn();
    }

    popUpMessage(message) {
        let popup = document.createElement('div');
        popup.classList.add('popup')
        popup.innerHTML = message;
        this.table.append(popup);
    }

}
