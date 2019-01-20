const Action = require("../../../engineCommon/actions/Action");

const MatchThreeMatchAction = new Phaser.Class({
    Extends: Action,

    initialize:
        function MatchThreeMatchAction(engine, data) {
            Action.call(this, data);
            this.matchThreeEngine = engine;
            this.tweens = [];

            const sequenceDelay = engine.gems.matchConfig.sequenceDelay;

            this.addTween(data.src);
            for (var i = 0; i < data.left.length; ++i) {
                this.addTween(data.left[i], sequenceDelay + sequenceDelay * i);
                data.left[i].matchAction = this;
            }
            for (var i = 0; i < data.right.length; ++i) {
                this.addTween(data.right[i], sequenceDelay + sequenceDelay * i);
                data.right[i].matchAction = this;
            }
            for (var i = 0; i < data.top.length; ++i) {
                this.addTween(data.top[i], sequenceDelay + sequenceDelay * i);
                data.top[i].matchAction = this;
            }
            for (var i = 0; i < data.bottom.length; ++i) {
                this.addTween(data.bottom[i], sequenceDelay + sequenceDelay * i);
                data.bottom[i].matchAction = this;
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
            const tween = this.matchThreeEngine.gameScene.tweens.add({
                targets: gem,
                paused: true,
                delay: delay,
                scaleX: 0.001,
                scaleY: 0.001,
                duration: this.matchThreeEngine.gems.matchConfig.duration,
                ease: this.matchThreeEngine.gems.matchConfig.ease,
                onComplete: () => {
                    gem.matchAction = undefined;
                    this.tweens.splice(this.tweens.indexOf(tween), 1);
                }
            });
            this.tweens.push(tween);
        }
});

module.exports = MatchThreeMatchAction;