class Piece {
    constructor(color, r, c) {
        this.color = color;
        this.r = r;
        this.c = c;
        this.d = (color === 'red') ? 1 : -1;
        this.absoluteMoves = [[this.d, 1], [this.d, -1]];
        this.validSteps = [];
        this.el = document.createElement('div');
        this.el.classList.add('piece', color);
    }
    getPosition() {
        return [this.r, rjis.c];
    }
    setPosition(r, c) {
        this.r = r; this.c = c;
    }
    calcValidSteps(matrix) {
        this.validSteps = [];
        for (const step of this.absoluteMoves) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c < 8 && new_c >= 0)
                this.validSteps.push([new_r, new_c]);
        }
    }

}
export default Piece;