const gameDifficulty = [20, 50, 70];

class Game {
    constructor(difficultyLevel = 1) {
        this.difficulty = gameDifficulty[difficultyLevel - 1];
        this.cols = 3;
        this.rows = 3;
        this.count = this.cols * this.rows;
        this.blocks = document.getElementsByClassName('puzzle-block');
        this.empyBlockCoords = [2, 2];
        this.indexes = [];
        this.init();
    }

    init() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const blockIdx = x + y * this.cols;
                if (blockIdx + 1 >= this.count) break;
                const block = this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx, x, y);
                block.addEventListener('click', () => this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.indexes.push(this.count - 1);
        this.randomize(this.difficulty);
    }

    randomize(iterationCount) {
        for (let i = 0; i < iterationCount; i++) {
            let randomBlockIdx = Math.floor(Math.random() * (this.count - 1));
            let moved = this.moveBlock(randomBlockIdx);
            if (!moved) i--;
        }
    }

    moveBlock(blockIdx) {
        let block = this.blocks[blockIdx];
        let blockCoords = this.canMoveBlock(block);
        if (blockCoords != null) {
            this.positionBlockAtCoord(blockIdx, this.empyBlockCoords[0], this.empyBlockCoords[1]);
            this.indexes[this.empyBlockCoords[0] + this.empyBlockCoords[1] * this.cols] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols];
            this.empyBlockCoords[0] = blockCoords[0];
            this.empyBlockCoords[1] = blockCoords[1];
            return true;
        }
        return false;
    }

    canMoveBlock(block) {
        let blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
        let blockWidth = block.clientWidth;
        let blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth];
        let diff = [Math.abs(blockCoords[0] - this.empyBlockCoords[0]), Math.abs(blockCoords[1] - this.empyBlockCoords[1])];
        let canMove = (diff[0] == 1 && diff[1] === 0) || (diff[0] === 0 && diff[1] === 1);
        if (canMove) return blockCoords;
        else return null;
    }

    positionBlockAtCoord(blockIdx, x, y) {
        let block = this.blocks[blockIdx];
        block.style.left = x * block.clientWidth + 'px';
        block.style.top = y * block.clientHeight + 'px';
    }

    onClickOnBlock(blockIdx) {
        if (this.moveBlock(blockIdx)) {
            if (this.checkPuzzleSolved()) {
                setTimeout(() => alert('Puzzle solved!!'), 600);
            }
        }
    }

    checkPuzzleSolved() {
        for (let i = 0; i < this.indexes.length; i++) {
            if (i === this.empyBlockCoords[0] + this.empyBlockCoords[1] * this.cols) continue;
            if (parseInt(this.indexes[i]) !== i) return false;
        }
        return true;
    }

    setDifficulty(difficultyLevel) {
        this.difficulty = gameDifficulty[difficultyLevel - 1];
        this.randomize(this.difficulty);
    }
}

// Create an instance of the Game class
const game = new Game(1);

const difficulty_btn = Array.from(document.getElementsByClassName('difficulty-btn'));
difficulty_btn.forEach((element, idx) => {
    element.addEventListener('click', (e) => {
        difficulty_btn[gameDifficulty.indexOf(game.difficulty)].classList.remove('active');
        element.classList.add('active');
        game.setDifficulty(idx + 1);
    });
});
