const MatchThreeScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
        function MatchThreeScene() {
            Phaser.Scene.call(this);
        },

    preload:
        function() {
            if (undefined !== this.engine.assetPacks) {
                this.load.pack("main", this.engine.assetPacks);
            }
            else {
                throw new Error("[MatchThreeScene->Preload] Asset packs are undefined.");
            }
        },

    create:
        function() {
            this.engine.initScene(this);
            this.engine.drawDebug();
        }
});

module.exports = MatchThreeScene;