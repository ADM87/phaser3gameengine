const KeyboardHelper = new Phaser.Class({
    initialize:
        function KeyboardHelper() {
            this.keys = [];
        },

    addKey:
        function(name, key) {
            this[name] = new KeyHelper(name, key);
            this.keys.push(this[name]);
        },

    pollInput:
        function() {
            this.keys.forEach(element => element.poll());
        },

    dumpKeys:
        function() {
            while (this.keys.length > 0) {
                const keyHelper = this.keys.shift();
                keyHelper.shutdown();
                delete this[keyHelper.name];
            }
            this.keys = [];
        }
});

const KeyHelper = new Phaser.Class({
    Extends: Phaser.Events.EventEmitter,

    initialize:
        function KeyHelper(name, key) {
            Phaser.Events.EventEmitter.call(this);
            this.name = name;
            this.key = key;

            this.isDown = key.isDown;
            this.isUp = key.isUp;
        },

    poll:
        function() {
            if (!this.isDown && this.key.isDown) {
                this.isDown = this.key.isDown;
                this.isUp = false;
                this.emit("changed", this.name, this.isUp, this.isDown);
            }
            else if (!this.isUp && this.key.isUp) {
                this.isUp = this.key.isUp;
                this.isDown = false;
                this.emit("changed", this.name, this.isUp, this.isDown);
            }
        },

    shutdown:
        function() {
            this.key = null;
            Phaser.Events.EventEmitter.prototype.shutdown.call(this);
        }
});

module.exports = KeyboardHelper;