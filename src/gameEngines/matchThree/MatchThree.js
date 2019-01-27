/**
 * Dependencies used in the Match Three game engine.
 * 
 * Class definitions provide the base interface for the match three engine.
 * For custom behaviour, simply override and extend any of the definitions.
 */
const MatchThree = {
    Engine: require("./MatchThreeEngine"),
    ClassDefinitions: {
        GameScene: require("./MatchThreeScene"),
        Matrix: require("./objects/MatchThreeMatrix"),
        Cell: require("./objects/MatchThreeCell"),
        Selecter: require("./objects/MatchThreeSelecter"),
        Gem: require("./objects/MatchThreeGem"),
        GemManager: require("./managers/MatchThreeGemManager"),
        InputManager: require("./managers/MatchThreeInputManager"),
        SwapAction: require("./actions/MatchThreeSwapAction"),
        MatchAction: require("./actions/MatchThreeMatchAction"),
        CascadeAction: require("./actions/MatchThreeCascadeAction")
    },
    Variables: {
        ConfigKey: "matchThreeConfig",
        Locks: {
            None: 0,
            Swap: 1 << 0,
            Match: 1 << 1,
            Cascade: 1 << 2
        }
    },
    AssetPacks: undefined
};

module.exports = MatchThree;