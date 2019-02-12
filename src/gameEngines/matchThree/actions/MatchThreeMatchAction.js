const Action = require("../../../engineCommon/actions/Action");

const MatchThreeMatchAction = new Phaser.Class({
    Extends: Action,

    initialize:
        function MatchThreeMatchAction(engine, data) {
            Action.call(this, data);
            this.matchThreeEngine = engine;
            this.tweens = [];

            const sequenceDelay = engine.gems.matchConfig.sequenceDelay;

            const length = Math.max(data.left.length, data.right.length, data.top.length, data.bottom.length);
            for (var i = 0; i < length; ++i) {
                const targets = []
                if (i < data.left.length) {
                    targets.push(data.left[i]);
                    data.left[i].cascadeAction = this;
                }
                if (i < data.right.length) {
                    targets.push(data.right[i]);
                    data.right[i].cascadeAction = this;
                }
                if (i < data.top.length) {
                    targets.push(data.top[i]);
                    data.top[i].cascadeAction = this;
                }
                if (i < data.bottom.length) {
                    targets.push(data.bottom[i]);
                    data.bottom[i].cascadeAction = this;
                }
                this.addTween(targets, sequenceDelay + sequenceDelay * i);
            }
            this.addTween(data.src);
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
        function(gems, delay = 0) {
            if (!Array.isArray(gems)) {
                gems = [gems];
            }
            const tween = this.matchThreeEngine.gameScene.tweens.add({
                targets: gems,
                paused: true,
                delay: delay,
                scaleX: 0.001,
                scaleY: 0.001,
                duration: this.matchThreeEngine.gems.matchConfig.duration,
                ease: this.matchThreeEngine.gems.matchConfig.ease,
                onComplete: () => {
                    gems.forEach(gem => gem.matchAction = undefined);
                    this.tweens.splice(this.tweens.indexOf(tween), 1);
                    this.matchThreeEngine.events.emit("gemMatchComplete", gems);
                }
            });
            this.tweens.push(tween);
        }
});

module.exports = MatchThreeMatchAction;