// import Piece from "./Piece.js";

class Group {
    constructor(color, matrix) {
        this.color = color;
        this.piecesList = [];
        this.createPiecesList(matrix);
    }
    createPiecesList(matrix) {
        let k = (this.color === 'red') ? 0 : 5;
        for (let i = 0; i < 12; i++) {
            let r = k + i % 3;
            let c = 2 * (i % 4) + r % 2
            this.piecesList[i] = new Piece(this.color, r, c, i);
        }
    }
    insertPiece(piece) {
        this.piecesList.push(piece);
    }

}

// export default Group;