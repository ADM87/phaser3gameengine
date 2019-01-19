const MatchThreeInputManager = new Phaser.Class({
    initialize:
        function(engine) {
            this.engine = engine;

            this.engine.gameScene.input.on("pointerdown", this.onPointerDown, this);
            this.engine.gameScene.input.on("pointerup", this.onPointerUp, this);
        },

    onPointerDown:
        function() {
            this.pointerIsDown = true;
        },

    onPointerUp:
        function() {
            this.pointerIsDown = false;
        },

    processInput:
        function(t, dt) {
            const cell = this.engine.matrix.getActiveCell();
            if (undefined !== cell && !cell.isLocked() && this.engine.gems.isValid(cell.column, cell.row)) {
                if (!cell.equals(this.activeCell)) {
                    if (undefined !== this.activeCell && this.pointerIsDown && this.engine.matrix.isAdjacent(this.activeCell.column, this.activeCell.row, cell.column, cell.row)) {
                        this.engine.gems.swapAt(this.activeCell.column, this.activeCell.row, cell.column, cell.row);

                        this.pointerIsDown = false;
                        this.activeCell = undefined;
                    }
                    else {
                        this.activeCell = cell;
                    }

                    const pos = cell.getCenter();
                    this.engine.selecter.show(pos.x, pos.y);
                }
            }
            else {
                this.activeCell = undefined;
                this.engine.selecter.hide();
            }
        }
});

module.exports = MatchThreeInputManager;