import "phaser";

const MatchThree = require("./gameEngines/matchThree/MatchThree");
MatchThree.AssetPacks = {
    main: {
        files: [
            { type: "json", key: "gameConfig", url: "./assets/matchThree/config.json" },
            { type: "image", key: "blueGem", url: "./assets/matchThree/images/platformPack_item001.png" },
            { type: "image", key: "yellowGem", url: "./assets/matchThree/images/platformPack_item002.png" },
            { type: "image", key: "greenGem", url: "./assets/matchThree/images/platformPack_item003.png" },
            { type: "image", key: "redGem", url: "./assets/matchThree/images/platformPack_item004.png" }
        ]
    }
};

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    plugins: { 
        global: [
            MatchThree.Engine.PluginConfig,
            require("./engineCommon/utility/ScreenResizer").PluginConfig
        ] 
    },
    scene: MatchThree.GameScene
});