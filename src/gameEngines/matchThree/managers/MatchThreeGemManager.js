const StringUtils = require("../../../engineCommon/utility/StringUtils");
const ObjectPool = require("../../../engineCommon/utility/ObjectPool");

const MatchThreeGemManager = new Phaser.Class({
    initialize:
        function MatchThreeGemManager(engine, config) {
            this.matchThreeEngine = engine;
            this.config = config || {};
            this.types = Object.keys(this.config.types || {});
            this.swapConfig = config.swapConfig || {};
            this.matchConfig = config.matchConfig || {};
            this.cascadeConfig = config.cascadeConfig || {};
            this.addMatrixMask = config.addMatrixMask || false;
            this.gemContainer = this.matchThreeEngine.gameScene.add.container();
            this.gemPool = new ObjectPool(this.allocateGem, this.deallocateGem, this, this.matchThreeEngine.matrix.columns * this.matchThreeEngine.matrix.rows);

            if (this.addMatrixMask) {
                const bounds = this.matchThreeEngine.matrix.getBounds();
                const maskShape = this.matchThreeEngine.gameScene.make.graphics();
                maskShape.fillStyle(0xffffff, 1);
                maskShape.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
                this.gemContainer.mask = new Phaser.Display.Masks.GeometryMask(this.matchThreeEngine.gameScene, maskShape);
            }
        },

    populateGemBoard:
        function() {
            this.activeGems = []; // Contains gem objects that are not cascading
            this.dropMap = []; // Contains gem objects that are going to cascade
            this.activeColumns = []; // Counters for the number of actions on a single column
            for (var x = 0; x < this.matchThreeEngine.matrix.columns; ++x) {
                this.activeGems.push([]);
                this.dropMap.push([]);
                this.activeColumns.push(0);
                for (var y = 0; y < this.matchThreeEngine.matrix.rows; ++y) {
                    this.activeGems[x].push(this.gemPool.take());
                    this.activeGems[x][y].awake({ column: x, row: y, type: this.getNewGemType(x, y, false) });
                    this.gemContainer.add(this.activeGems[x][y]);
                }
            }
        },

    processGemBoard:
        function(t, dt) {
            for (var column = 0; column < this.activeColumns.length; ++column) {
                if (this.activeColumns[column] === 0 && this.dropMap[column].length > 0) {
                    this.cascade(column);
                }
            }
        },

    getNewGemType:
        function(column, row, allowMatches) {
            while (this.types.length > 2) {
                const type = this.config.types[Phaser.Utils.Array.GetRandom(this.types)];
                if (!allowMatches && this.hasMatch(column, row, type)) {
                    continue;
                }
                return type;
            }
            throw new Error(StringUtils.format("[MatchThreeGemManager->GetNewGemType] Minimum 3 gem types. Found %0", this.types.length));
        },

    swapAt:
        function(c1, r1, c2, r2, allowSwapBack = true) {
            if (this.matchThreeEngine.matrix.isLocked(c1, r1) || this.matchThreeEngine.matrix.isLocked(c2, r2)) {
                return;
            }

            const gem1 = this.activeGems[c1][r1];
            const gem2 = this.activeGems[c2][r2];

            gem1.setCell(c2, r2);
            gem2.setCell(c1, r1);

            this.activeGems[c2][r2] = gem1;
            this.activeGems[c1][r1] = gem2;

            this.matchThreeEngine.matrix.addLock(c1, r1, this.matchThreeEngine.variables.Locks.Swap);
            this.matchThreeEngine.matrix.addLock(c2, r2, this.matchThreeEngine.variables.Locks.Swap);

            this.activeColumns[c1]++;
            this.activeColumns[c2]++;

            const swapData = {
                allowSwapBack: allowSwapBack,
                gems: [
                    { gem: gem1, to: { column: c2, row: r2 } },
                    { gem: gem2, to: { column: c1, row: r1 } }
                ]
            };
            this.matchThreeEngine.actions.add(this.matchThreeEngine.create("SwapAction", swapData)).start().once("complete", this.swapComplete, this);
        },

    swapComplete:
        function(swapData) {
            const gem1 = swapData.gems[0].gem;
            const gem2 = swapData.gems[1].gem;

            const hasMatch1 = this.hasMatch(gem1.column, gem1.row, gem1.type);
            const hasMatch2 = this.hasMatch(gem2.column, gem2.row, gem2.type);

            this.matchThreeEngine.matrix.removeLock(gem1.column, gem1.row, this.matchThreeEngine.variables.Locks.Swap);
            this.matchThreeEngine.matrix.removeLock(gem2.column, gem2.row, this.matchThreeEngine.variables.Locks.Swap);

            this.activeColumns[gem1.column]--;
            this.activeColumns[gem2.column]--;

            if (!hasMatch1 && !hasMatch2) {
                if (swapData.allowSwapBack) {
                    this.swapAt(gem1.column, gem1.row, gem2.column, gem2.row, false);
                }
            }
            else {
                if (hasMatch1) {
                    this.matchAt(gem1.column, gem1.row);
                }
                if (hasMatch2) {
                    this.matchAt(gem2.column, gem2.row);
                }
            }
        },

    matchAt:
        function(column, row) {
            const gem = this.activeGems[column][row];

            var leftList = [];
            for (var x = column - 1; x >= 0 && this.checkAt(x, row, gem.type); --x) {
                leftList.push(this.activeGems[x][row]);
            }
            var rightList = [];
            for (var x = column + 1; x < this.activeGems.length && this.checkAt(x, row, gem.type); ++x) {
                rightList.push(this.activeGems[x][row]);
            }
            var topList = [];
            for (var y = row - 1; row >= 0 && this.checkAt(column, y, gem.type); --y) {
                topList.push(this.activeGems[column][y]);
            }
            var bottomList = [];
            for (var y = row + 1; row < this.activeGems[column].length && this.checkAt(column, y, gem.type); ++y) {
                bottomList.push(this.activeGems[column][y]);
            }

            this.matchThreeEngine.matrix.addLock(gem.column, gem.row, this.matchThreeEngine.variables.Locks.Match);
            this.dropMap[gem.column].push(gem);
            this.activeColumns[gem.column]++;

            if (leftList.length + rightList.length < 2) {
                leftList = rightList = [];
            }
            else {
                leftList.forEach(matchGem => {
                    this.matchThreeEngine.matrix.addLock(matchGem.column, matchGem.row, this.matchThreeEngine.variables.Locks.Match);
                    this.dropMap[matchGem.column].push(matchGem);
                    this.activeColumns[matchGem.column]++;
                });
                rightList.forEach(matchGem => {
                    this.matchThreeEngine.matrix.addLock(matchGem.column, matchGem.row, this.matchThreeEngine.variables.Locks.Match);
                    this.dropMap[matchGem.column].push(matchGem);
                    this.activeColumns[matchGem.column]++;
                });
            }
            if (topList.length + bottomList.length < 2) {
                topList = bottomList = [];
            }
            else {
                topList.forEach(matchGem => {
                    this.matchThreeEngine.matrix.addLock(matchGem.column, matchGem.row, this.matchThreeEngine.variables.Locks.Match);
                    this.dropMap[matchGem.column].push(matchGem);
                    this.activeColumns[matchGem.column]++;
                });
                bottomList.forEach(matchGem => {
                    this.matchThreeEngine.matrix.addLock(matchGem.column, matchGem.row, this.matchThreeEngine.variables.Locks.Match);
                    this.dropMap[matchGem.column].push(matchGem);
                    this.activeColumns[matchGem.column]++;
                });
            }

            const matchData = {
                src: gem,
                left: leftList,
                right: rightList,
                top: topList,
                bottom: bottomList
            }
            this.matchThreeEngine.actions.add(this.matchThreeEngine.create("MatchAction", matchData)).start().once("complete", this.matchComplete, this);
        },

    matchComplete:
        function(matchData) {
            const gem = matchData.src;
            this.activeColumns[gem.column]--;

            matchData.left.forEach(matchGem => this.activeColumns[matchGem.column]--);
            matchData.right.forEach(matchGem => this.activeColumns[matchGem.column]--);
            matchData.top.forEach(matchGem => this.activeColumns[matchGem.column]--);
            matchData.bottom.forEach(matchGem => this.activeColumns[matchGem.column]--);
        },

    cascade:
        function(column) {
            this.dropMap[column].sort((gem1, gem2) => {
                return Math.sign(gem2.row - gem1.row);
            });

            var bottom = -1;
            for (var i = 0; i < this.dropMap[column].length; ++i) {
                bottom = Math.max(bottom, this.dropMap[column][i].row);

                this.matchThreeEngine.matrix.removeLock(column, this.dropMap[column][i].row, this.matchThreeEngine.variables.Locks.Match);

                const index = this.activeGems[column].indexOf(this.dropMap[column][i]);
                this.activeGems[column].splice(index, 1);
                this.activeGems[column].unshift(this.dropMap[column][i]);
            }

            const cascadeList = [];
             for (var row = bottom; row >= 0; --row) {
                if (undefined !== this.activeGems[column][row].cascadeAction) {
                    this.activeGems[column][row].cascadeAction.kill();
                }

                this.matchThreeEngine.matrix.addLock(column, row, this.matchThreeEngine.variables.Locks.Cascade);

                const index = this.dropMap[column].indexOf(this.activeGems[column][row]);
                if (index >= 0) {
                    const cell = this.matchThreeEngine.matrix.getCell(column, row);
                    const cellPos = cell.getCenter();
                    const dropPos = { x: cellPos.x, y: this.matchThreeEngine.matrix.position.y - (this.matchThreeEngine.matrix.cellSize * 0.5) };

                    dropPos.y -= (bottom - this.dropMap[column][index].row) * this.matchThreeEngine.matrix.cellSize;

                    this.activeGems[column][row].awake({ column: column, row: row });
                    this.activeGems[column][row].setPosition(dropPos.x, dropPos.y);
                }
                else {
                    this.activeGems[column][row].setCell(column, row);
                }

                cascadeList.push(this.activeGems[column][row]);
             }

             this.dropMap[column].forEach(gem => gem.assignType(this.getNewGemType(gem.column, gem.row, false)));
             this.dropMap[column] = [];

             const cascadeData = {
                gems: cascadeList
             };
            this.matchThreeEngine.actions.add(this.matchThreeEngine.create("CascadeAction", cascadeData)).start().once("complete", this.cascadeComplete, this);
        },

    cascadeComplete:
        function(cascadeData) {
            const gems = cascadeData.gems;
            gems.forEach(gem => {
                this.matchThreeEngine.matrix.removeLock(gem.column, gem.row, this.matchThreeEngine.variables.Locks.Cascade);
                if (!this.matchThreeEngine.matrix.isLocked(gem.column, gem.row) && this.hasMatch(gem.column, gem.row, gem.type)) {
                    this.matchAt(gem.column, gem.row);
                }
            });
        },

    hasMatch:
        function(column, row, type) {
            if ((this.checkAt(column - 1, row, type) && (this.checkAt(column - 2, row, type) || this.checkAt(column + 1, row, type))) ||
                (this.checkAt(column + 1, row, type) && this.checkAt(column + 2, row, type))) {
                return true;
            }
            if ((this.checkAt(column, row - 1, type) && (this.checkAt(column, row - 2, type) || this.checkAt(column, row + 1, type))) ||
                (this.checkAt(column, row + 1, type) && this.checkAt(column, row + 2, type))) {
                return true;
            }
            return false;
        },

    getActiveGem:
        function(column, row) {
            return this.isValid(column, row) && !this.matchThreeEngine.matrix.isLocked(column, row) ? this.activeGems[column][row] : undefined;
        },

    checkAt:
        function(column, row, type) {
            return this.isValid(column, row) && !this.matchThreeEngine.matrix.isLocked(column, row) && this.activeGems[column][row].type.key === type.key;
        },

    isValid:
        function(column, row) {
            return column >= 0 && column < this.activeGems.length && row >= 0 && row < this.activeGems[column].length && undefined !== this.activeGems[column][row];
        },

    allocateGem:
        function() {
            // TODO - Other one time gem init stuff
            return this.matchThreeEngine.create("Gem");
        },

    deallocateGem:
        function(gem) {
            // TODO - Clean up
        },

    destroy:
        function() {
            this.matchThreeEngine = undefined;
            this.config = undefined;
        }
});

module.exports = MatchThreeGemManager;