class Piece {
    constructor(color, r, c) {
        this.color = color;
        this.r = r;
        this.c = c;
        this.d = (color === 'red') ? 1 : -1;
        this.directions = [[this.d, 1], [this.d, -1]];
        this.validSteps = [];
        this.pi = [];
        this.el = document.createElement('div');
        this.el.classList.add('piece', color);
    }
    getPosition() {
        return [this.r, rjis.c];
    }
    setPosition(r, c) {
        this.r = r; this.c = c;
        if (this.r + this.d === -1 || this.r + this.d === 8) {
            this.el.classList.add('king');
            this.directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
        }
    }
    calcValidSteps(matrix) {
        const source = {
            'cell': [this.r, this.c],
            'from': undefined,
            'delay': 1
        };
        this.validSteps = [];
        // this.validSteps.push(source);

        this.pi.push
        for (const direction of this.directions) {
            let new_r = this.r + direction[0], new_c = this.c + direction[1];
            if (new_r < 0 || new_r >= 8 || new_c >= 8 || new_c < 0) continue;
            console.log([new_r, new_c]);
            if (!matrix[new_r][new_c]) {
                const validStep = {
                    'cell': [new_r, new_c],
                    'from': source,
                    'delay': source['delay'] * 1.5
                };
                this.validSteps.push(validStep);
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
        if (matrix[new_r][new_c] === 1) return;

        const validStep = {
            'cell': [new_r, new_c],
            'from': prevCell,
            'delay': prevCell['delay'] * 1.5 + 2
        };
        matrix[new_r][new_c] = 1;

        this.validSteps.push(validStep);
        for (const dir of this.directions)
            this.checkDiagonal(matrix, dir, validStep);
    }
}


// export default Piece;