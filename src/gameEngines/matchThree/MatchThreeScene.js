const MatchThreeScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
        function MatchThreeScene() {
            Phaser.Scene.call(this);
        },

    preload:
        function() {
            if (undefined !== this.matchThreeEngine.assetPacks) {
                this.load.pack("main", this.matchThreeEngine.assetPacks);
            }
            else {
                throw new Error("[MatchThreeScene->Preload] Asset packs are undefined.");
            }
        },

    create:
        function() {
            this.matchThreeEngine.initScene(this);
            this.matchThreeEngine.gems.populateGemBoard();
            this.matchThreeEngine.drawDebug();
        }
});

module.exports = MatchThreeScene;