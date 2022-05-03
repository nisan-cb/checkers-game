class Piece {
    constructor(color, r, c, id) {
        this.color = color;
        this.id = id;
        this.r = r;
        this.c = c;
        this.isQueen = false;
        this.d = (color === 'red') ? 1 : -1;
        this.directions = [[this.d, 1], [this.d, -1]];
        this.validSteps = [];
        this.el = document.createElement('div');
        this.el.classList.add('piece', color);
    }

    setPosition(r, c) {
        this.r = r; this.c = c;
        if (this.r + this.d === -1 || this.r + this.d === 8) { // means if now can be queen
            this.el.classList.add('queen');
            this.isQueen = true;
            this.directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
        }
    }

    calcValidSteps(matrix) {
        const source = {
            'cell': [this.r, this.c],
            'from': undefined,
            'length': 0,
            'delay': 1
        };

        this.validSteps = [];

        for (const direction of this.directions) {
            let new_r = this.r + direction[0], new_c = this.c + direction[1];
            if (new_r < 0 || new_r >= 8 || new_c >= 8 || new_c < 0) continue;
            if (!matrix[new_r][new_c]) { // if the cell is empty
                const validStep = {
                    'cell': [new_r, new_c],
                    'from': source,
                    'length': source['length'] + 1,
                    'delay': source['delay'] * 1.5
                };
                matrix[new_r][new_c] = validStep;
                this.validSteps.push([new_r, new_c]);
            } else {
                this.checkDiagonal(matrix, direction, source);
            }
        }
    }

    checkDiagonal(matrix, direction, prevCell) {
        let new_r = prevCell['cell'][0] + 2 * direction[0];
        let new_c = prevCell['cell'][1] + 2 * direction[1];
        if (new_r < 0 || new_r >= 8 || new_c < 0 || new_c >= 8)
            return;

        const cellA = matrix[new_r - direction[0]][new_c - direction[1]];
        const cellB = matrix[new_r][new_c];

        if (!cellA || cellA.color === this.color) return;
        if (cellB) return;

        const validStep = {
            'cell': [new_r, new_c],
            'from': prevCell,
            'length': prevCell['length'] + 1,
            'delay': prevCell['delay'] * 1.5 + 2
        };
        matrix[new_r][new_c] = validStep;

        this.validSteps.push([new_r, new_c]);

        for (const direrction of this.directions)
            this.checkDiagonal(matrix, direrction, validStep);
    }

    remove(group) {
        for (let i = 0; i < group.piecesList.length; i++)
            if (group.piecesList[i].id === this.id)
                group.piecesList.splice(i, 1);
    }

    levelDown() {
        this.isQueen = false;
        this.directions = [[this.d, 1], [this.d, -1]];
        this.el.classList.remove('queen');
    }
}