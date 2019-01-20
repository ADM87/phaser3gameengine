const MatchThreeSelecter = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:
        function MatchThreeSelecter(engine, config) {
            Phaser.GameObjects.Container.call(this, engine.gameScene);
            this.matchThreeEngine = engine;
            this.config = config;

            const size = config.size || 0;
            const half = size / 2

            const graphics = this.matchThreeEngine.gameScene.add.graphics();
            graphics.lineStyle(2, config.idleColor, 1);
            graphics.strokeRect(-half, -half, size, size);
            this.add(graphics);
        },

    show:
        function(x, y) {
            this.visible = true;
            this.setPosition(x, y);
        },

    hide:
        function() {
            this.visible = false;
        }
});

module.exports = MatchThreeSelecter;