const Action = require("../../../engineCommon/actions/Action");

const MatchThreeSwapAction = new Phaser.Class({
    Extends: Action,

    initialize:
        function MatchThreeSwapAction(engine, data) {
            Action.call(this, data);
            this.engine = engine;
            this.tweens = [];

            const gems = data.gems;
            gems.forEach(swap => {
                swap.gem.swapAction = this;

                const swapCell = engine.matrix.getCell(swap.to.column, swap.to.row);
                const swapPos = swapCell.getCenter()
                const tween = engine.gameScene.tweens.add({
                    targets: swap.gem,
                    paused: true,
                    x: swapPos.x,
                    y: swapPos.y,
                    duration: engine.gems.swapConfig.duration,
                    ease: engine.gems.swapConfig.ease,
                    onComplete: () => {
                        swap.gem.swapAction = undefined;
                        this.tweens.splice(this.tweens.indexOf(tween), 1);
                    }
                });
                this.tweens.push(tween);
            });
        },

    start:
        function() {
            this.tweens.forEach(tween => tween.play());
            return Action.prototype.start.call(this);
        },

    process:
        function(t, dt) {
            return this.tweens.length === 0;
        },

    kill:
        function() {
            this.removeAllListeners();
            this.tweens.forEach(tween => tween.stop());
            this.tweens = [];
            Action.prototype.kill.call(this);
        },

    destroy:
        function() {
            this.tweens = [];
            this.engine = undefined;
            Action.prototype.destroy.call(this);
        }
});

module.exports = MatchThreeSwapAction;