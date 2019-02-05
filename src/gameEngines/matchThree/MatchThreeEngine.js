const StringUtils = require("../../engineCommon/utility/StringUtils");
const ActionManager = require("../../engineCommon/actions/ActionManager");

const MatchThreeEngine = new Phaser.Class({
    Extends: Phaser.Plugins.BasePlugin,

    initialize:
        function MatchThreeEngine(pluginManager) {
            Phaser.Plugins.BasePlugin.call(this, pluginManager);
            this.actions = new ActionManager();

            const MatchThree = require("./MatchThree");
            this.classes = MatchThree.ClassDefinitions;
            this.assetPacks = MatchThree.AssetPacks;
            this.variables = MatchThree.Variables;
        },

    initScene:
        function(scene) {
            if (undefined !== scene) {
                this.game = scene.game;
                this.gameScene = scene;

                this.config = scene.cache.json.get(this.variables.ConfigKey);

                this.matrix = this.create("Matrix");
                this.gems = this.create("GemManager");
                this.input = this.create("InputManager");
                this.selecter = this.create("Selecter");

                this.gameScene.children.add(this.selecter);

                this.game.events.on("step", this.update, this);
            }
        },

    update:
        function(t, dt) {
            if (undefined !== this.gameScene && this.gameScene.sys.settings.active) {
                this.gems.processGemBoard(t, dt);
                this.input.processInput(t, dt);
                this.actions.processActions(t, dt);
            }
        },

    create:
        function(key, config) {
            if (Phaser.Utils.Objects.HasValue(this.classes, key)) {
                return new this.classes[key](this, config || this.config[key]);
            }
            else {
                throw new Error(StringUtils.format("[MatchThreeEngine->Create] Missing class definition '%0'", key));
            }
        },

    drawDebug:
        function() {
            this.matrix.drawDebug();
        }
});

MatchThreeEngine.PluginConfig = {
    key: "matchThree",
    plugin: MatchThreeEngine,
    mapping: "matchThreeEngine",
    start: true
};

module.exports = MatchThreeEngine;