const ObjectPool = new Phaser.Class({
    initialize:
        function ObjectPool(allocFunc, deallocFunc, ctx, seed) {
            this.allocFunc = allocFunc || Phaser.Utils.NOOP;
            this.deallocFunc = deallocFunc || Phaser.Utils.NOOP;
            this.ctx = ctx;
            this.free = [];

            seed = seed || 0;
            for (var i = 0; i < seed; ++i) {
                this.put(allocFunc.call(ctx));
            }
        },

    take:
        function() {
            if (this.free.length > 0) {
                return this.free.shift();
            }
            return this.allocFunc.call(this.ctx);
        },

    put:
        function(obj) {
            this.free.push(obj);
        },

    dispose:
        function() {

        }
});

module.exports = ObjectPool;