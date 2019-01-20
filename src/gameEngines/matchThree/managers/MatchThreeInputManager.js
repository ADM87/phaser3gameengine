const MatchThreeInputManager = new Phaser.Class({
    initialize:
        function(engine) {
            this.matchThreeEngine = engine;

            this.matchThreeEngine.gameScene.input.on("pointerdown", this.onPointerDown, this);
            this.matchThreeEngine.gameScene.input.on("pointerup", this.onPointerUp, this);
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
            const cell = this.matchThreeEngine.matrix.getActiveCell();
            if (undefined !== cell && !cell.isLocked() && this.matchThreeEngine.gems.isValid(cell.column, cell.row)) {
                if (!cell.equals(this.activeCell)) {
                    if (undefined !== this.activeCell && this.pointerIsDown && this.matchThreeEngine.matrix.isAdjacent(this.activeCell.column, this.activeCell.row, cell.column, cell.row)) {
                        this.matchThreeEngine.gems.swapAt(this.activeCell.column, this.activeCell.row, cell.column, cell.row);

                        this.pointerIsDown = false;
                        this.activeCell = undefined;
                    }
                    else {
                        this.activeCell = cell;
                    }

                    const pos = cell.getCenter();
                    this.matchThreeEngine.selecter.show(pos.x, pos.y);
                }
            }
            else {
                this.activeCell = undefined;
                this.matchThreeEngine.selecter.hide();
            }
        }
});

module.exports = MatchThreeInputManager;