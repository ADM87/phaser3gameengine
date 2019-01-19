const MatchThreeMatrix = new Phaser.Class({
    initialize:
        function MatchThreeMatrix(engine, config) {
            this.engine = engine;
            this.columns = config.columns || 0;
            this.rows = config.rows || 0;
            this.cellSize = config.cellSize || 0;
            this.position = config.position || { x: 0, y: 0 };

            this.cells = [];
            for (var x = 0; x < this.columns; ++x) {
                this.cells.push([]);
                for (var y = 0; y < this.rows; ++y) {
                    this.cells[x].push(this.engine.create("Cell", { 
                        x: this.position.x + x * this.cellSize, 
                        y: this.position.y + y * this.cellSize, 
                        column: x, 
                        row: y, 
                        size: this.cellSize, 
                        matrix: this
                    }));
                }
            }
        },

    addLock:
        function(column, row, lock) {
            const cell = this.getCell(column, row);
            if (undefined !== cell) {
                cell.addLock(lock);
            }
        },

    removeLock:
        function(column, row, lock) {
            const cell = this.getCell(column, row);
            if (undefined !== cell) {
                cell.removeLock(lock);
            }
        },

    isLocked:
        function(column, row) {
            const cell = this.getCell(column, row);
            return undefined !== cell ? cell.isLocked() : true;
        },

    toScreen:
        function(column, row) {
            return {
                x: this.position.x + (column * this.cellSize),
                y: this.position.y + (row * this.cellSize)
            };
        },

    toMatrix:
        function(x, y) {
            return {
                x: Math.floor((x - this.position.x) / this.cellSize),
                y: Math.floor((y - this.position.y) / this.cellSize)
            };
        },

    isAdjacent:
        function(c1, r1, c2, r2) {
            const dx = c2 - c1;
            const dy = r2 - r1;
            return (Math.abs(dx) === 1 && dy === 0) || (Math.abs(dy) === 1 && dx === 0);
        },

    getCell:
        function(column, row) {
            return this.isValid(column, row) ? this.cells[column][row] : undefined;
        },

    getActiveCell:
        function() {
            const pos = this.toMatrix(this.engine.gameScene.input.mousePointer.x, this.engine.gameScene.input.mousePointer.y);
            return this.getCell(pos.x, pos.y);
        },

    isValid:
        function(column, row) {
            return column >= 0 && column < this.columns && row >= 0 && row < this.rows;
        },

    drawDebug:
        function() {
            const graphics = this.engine.gameScene.add.graphics();
            this.cells.forEach(inner => { inner.forEach(cell => cell.drawDebug(graphics)); });
        }
});

module.exports = MatchThreeMatrix;