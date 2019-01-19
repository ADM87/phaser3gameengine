const Action = new Phaser.Class({
    Extends: Phaser.Events.EventEmitter,

    initialize:
        function(data) {
            Phaser.Events.EventEmitter.call(this);

            this.running = false;
            this.hasStarted = false;
            this.complete = false;
            this.data = data || {};
        },

    start:
        function() {
            this.running = true;
            return this;
        },

    pause:
        function() {
            this.running = false;
            return this;
        },

    kill:
        function() {
            this.running = false;
            this.complete = true;
        },

    step:
        function(t, dt) {
            if (this.running) {
                if (!this.hasStarted) {
                    this.hasStarted = true;
                    this.complete = false;
                    this.emit("start", this.data);
                }
                else if (!this.complete && this.process(t, dt)) {
                    this.complete = true;
                    this.emit("complete", this.data);
                }
            }
        },

    process:
        function(t, dt) {
            return true;
        },

    destroy:
        function() {
            this.data = undefined;
            Phaser.Events.EventEmitter.prototype.destroy.call(this);
        }
});

module.exports = Action;