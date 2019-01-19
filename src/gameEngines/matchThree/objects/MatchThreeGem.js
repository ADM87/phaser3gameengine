const StringUtils = require("../../../engineCommon/utility/StringUtils");

const MatchThreeGem = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:
        function MatchThreeGem(engine, config) {
            this.engine = engine;

            Phaser.GameObjects.Container.call(this, engine.gameScene);

            this.image = this.engine.gameScene.add.image();
            this.add(this.image);
        },

    awake:
        function(config) {
            this.setScale(1);

            this.assignType(config.type || this.type);
            this.setCell(config.column, config.row);

            const pos = this.engine.matrix.getCell(this.column, this.row).getCenter();
            this.setPosition(pos.x, pos.y);
        },

    trackMouse:
        function(track) {
            
        },

    assignType:
        function(type) {
            this.type = type;
            this.image.setTexture(type.key);
        },

    setCell:
        function(column, row) {
            this.column = column;
            this.row = row;
        }
});

module.exports = MatchThreeGem;