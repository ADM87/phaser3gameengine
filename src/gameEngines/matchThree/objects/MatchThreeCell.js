const StringUtils = require("../../../engineCommon/utility/StringUtils");

const MatchThreeCell = new Phaser.Class({
    Extends: Phaser.GameObjects.Zone,

    initialize:
        function MatchThreeCell(engine, config) {
            this.matchThreeEngine = engine;
            this.column = config.column || 0;
            this.row = config.row || 0;
            this.size = config.size || 0;
            this.matrix = config.matrix || undefined;
            this.locks = 0;

            Phaser.GameObjects.Zone.call(this, engine.gameScene, config.x || 0, config.y || 0, this.size, this.size);
        },

    destroy:
        function() {
            this.matrix = undefined;
            Phaser.GameObjects.Zone.prototype.destroy.call(this);
        },

    equals:
        function(other) {
            return undefined !== other && this.column === other.column && this.row === other.row;
        },

    getCenter:
        function() {
            return { x: this.x + (this.size * 0.5), y: this.y + (this.size * 0.5) };
        },

    addLock:
        function(lock) {
            if (!this.hasLock(lock)) {
                this.locks |= lock;
            }
        },

    removeLock:
        function(lock) {
            if (this.hasLock(lock)) {
                this.locks &= ~lock;
            }
        },

    hasLock:
        function(lock) {
            return (this.locks & lock) !== 0;
        },

    isLocked:
        function() {
            return this.locks !== this.matchThreeEngine.variables.Locks.None;
        },

    drawDebug:
        function(graphics) {
            const topLeft = { x: this.x, y: this.y };
            const topRight = { x: topLeft.x + this.width, y: topLeft.y };
            const bottomRight = { x: topRight.x, y: topRight.y + this.height };
            const bottomLeft = { x: topLeft.x, y: bottomRight.y };

            graphics.lineStyle(1, 0xf1f1f1, 1);
            graphics.beginPath();
            graphics.moveTo(topLeft.x, topLeft.y);
            graphics.lineTo(topRight.x, topRight.y);
            graphics.lineTo(bottomRight.x, bottomRight.y);
            graphics.lineTo(bottomLeft.x, bottomLeft.y);
            graphics.closePath();
            graphics.strokePath();

            this.matchThreeEngine.gameScene.add.text(topLeft.x + 2, topLeft.y + 2, StringUtils.format("[%0,%1]", this.column, this.row), { fontSize: "8px" });

            const lockDisplay = this.matchThreeEngine.gameScene.add.graphics();
            lockDisplay.lineStyle(2, 0xf10000, 0.5);
            lockDisplay.fillStyle(0x0e0e0e, 0.5);
            lockDisplay.beginPath();
            lockDisplay.moveTo(topLeft.x + 10, topLeft.y + 10);
            lockDisplay.lineTo(topRight.x - 10, topRight.y + 10);
            lockDisplay.lineTo(bottomRight.x - 10, bottomRight.y - 10);
            lockDisplay.lineTo(bottomLeft.x + 10, bottomLeft.y - 10);
            lockDisplay.closePath();
            lockDisplay.fillPath();
            lockDisplay.strokePath();
            this.matchThreeEngine.game.events.on("step", () => lockDisplay.visible = this.locks !== 0);
        }
});

module.exports = MatchThreeCell;