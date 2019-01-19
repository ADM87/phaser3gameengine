const Action = require("./Action");

const ActionManager = new Phaser.Class({
    initialize:
        function ActionManager() {
            this.actions = [];
        },

    add:
        function(action) {
            if (action instanceof Action) {
                this.actions.push(action);
            }
            return action;
        },

    processActions:
        function(t, dt) {
            for (var i = 0; i < this.actions.length;) {
                this.actions[i].step(t, dt);
                if (this.actions[i].complete) {
                    this.actions[i].destroy();
                    this.actions.splice(i, 1);
                    continue;
                }
                ++i;
            }
        }
});

module.exports = ActionManager;