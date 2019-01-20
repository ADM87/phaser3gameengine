const Action = require("../../../engineCommon/actions/Action");

const MatchThreeCascadeAction = new Phaser.Class({
    Extends: Action,

    initialize:
        function MatchThreeCascadeAction(engine, data) {
            Action.call(this, data);
            this.matchThreeEngine = engine;
            this.tweens = [];

            const sequenceDelay = engine.gems.cascadeConfig.sequenceDelay;

            for (var i = 0; i < data.gems.length; ++i) {
                this.addTween(data.gems[i], sequenceDelay + sequenceDelay * i);
                data.gems[i].cascadeAction = this;
            }
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
            this.matchThreeEngine = undefined;
            Action.prototype.destroy.call(this);
        },

    addTween:
        function(gem, delay = 0) {
            const cell = this.matchThreeEngine.matrix.getCell(gem.column, gem.row);
            const cellPos = cell.getCenter();
            const delta = cellPos.y - gem.y;
            const tween =this.matchThreeEngine.gameScene.tweens.add({
                targets: gem,
                paused: true,
                x: cellPos.x,
                y: cellPos.y,
                delay: delay,
                duration: this.matchThreeEngine.gems.cascadeConfig.duration,
                ease: this.matchThreeEngine.gems.cascadeConfig.ease,
                onComplete: () => {
                    gem.cascadeAction = undefined;
                    this.tweens.splice(this.tweens.indexOf(tween), 1);
                    cell.removeLock(this.matchThreeEngine.variables.Locks.Cascade);
                }
            })
            this.tweens.push(tween);
        }
})

module.exports = MatchThreeCascadeAction;