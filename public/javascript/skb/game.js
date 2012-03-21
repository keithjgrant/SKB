/**
 * SKB - A sokoban-inspired game
 * Author: Keith J Grant
 * keithjgrant@gmail.com
 */

var SKB = SKB || {};

SKB.conf = {
    TILE:           32,
    GAME_WIDTH:     16,
    GAME_HEIGHT:    12,
    LIGHT: 'light',
    DARK: 'dark'
};

// convenience functions
SKB.util = {

    /**
     * Get the tile (block, wall, or gate) at a given coord
     *
     * This assumes only one tile per grid space, which is true
     * EXCEPT during a movement animation.
     */
    tileAt: function(c, r) {
        var matches = this.entitiesAt(c, r, ['Block', 'wall', 'gate']);
        
        if (matches.length) {
            return matches[0];
        }

        return false;
    },

    // Get list of entities at a coordinate on the grid
    entitiesAt: function(c, r, filter) {
        var coords = {
            _x: c * SKB.conf.TILE,
            _y: r * SKB.conf.TILE,
            _w: SKB.conf.TILE,
            _h: SKB.conf.TILE
        },
            matches = Crafty.map.search(coords);

        if (filter && filter instanceof Array) {
            matches = this.filterEntitiesByComponent(matches, filter);
        }

        return matches;
    },

    // Returns array of entities that have compenents listed in filter array
    filterEntitiesByComponent: function(entities, filter) {
        var e, f, filtered = [];

        for (e in entities) {
            for (f in filter) {
                if (entities[e].has(filter[f])) {
                    filtered.push(entities[e]);
                }
            }
        }

        return filtered;
    },

    /**
     * Returns true if blocks at both coordinates are the same type
     */
    blocksMatch: function(coordsA, coordsB) {
        var blockA = this.tileAt(coordsA.c, coordsA.r),
            blockB = this.tileAt(coordsB.c, coordsB.r);

        if (!blockA || !blockB ||
          !blockA.has('Block') || !blockB.has('Block')) {
            return false;
        }

        return blockA.color === blockB.color;
    }
};

SKB.core = (function(env) {
    var conf = SKB.conf,
        LIGHT = conf.LIGHT,
        DARK = conf.DARK,
        loader,
        Game,
        Map,
        init;

    loader = new env.EntityLoader(conf);

    Map = function() {
        this.goals = [];
    };
    Map.prototype = {
        /*
         *  SERIALIZED MAP FORMAT:
         *  tiles: 16x12 array of:
         *  0 - wall
         *  1 - dark block
         *  2 - dark loop block
         *  3 - light block
         *  4 - light loop block
         *  5 - gate
         *
         *  goals: {color:<0/1>,c,r}
         *  player: {c, r}
         */
        deserializeLevel: function(data) {
            Crafty.scene(name, $.proxy(function() {
                var r, c, i, j;

                for (r = 0; r < conf.GAME_HEIGHT; r++) {
                    for (c = 0; c < conf.GAME_WIDTH; c++) {
                        if (data.tiles[r] && data.tiles[r][c]) {
                            this.deserializeTile(c, r, data.tiles[r][c]);
                        } else {
                            this.deserializeTile(c, r, 0);
                        }
                    }
                }

                for (i in data.goals) {
                    this.addGoal(
                        data.goals[i].c,
                        data.goals[i].r,
                        data.goals[i].color ? LIGHT : DARK
                    );
                }

                loader.player(data.player.c, data.player.r);
                        
            }, this));
            Crafty.scene(name);
        },

        deserializeTile: function(c, r, tile) {
            if (tile === 0) {
                loader.wall(c, r);
            } else if (tile === 1) {
                loader.block(c, r, DARK, this);
            } else if (tile === 2) {
                loader.goalBlock(c, r, DARK, this);
            } else if (tile === 3) {
                loader.block(c, r, LIGHT, this);
            } else if (tile === 5) {
                loader.gate(c, r);
            }
        },

        serializeTile: function() {
            console.log("map.serializeTile() not yet implemented");
        },

        addGoal: function(c, r, color) {
            this.goals.push(loader.goal(c, r, color));
        },

        levelIsComplete: function() {
            var i,
                tile;

            for (i in this.goals) {
                tile = SKB.util.tileAt(this.goals[i].c, this.goals[i].r);

                if (tile.color !== this.goals[i].color) {
                    return false;
                }
            }

            return true;
        },

        checkMapCompletion: function() {
            if (this.levelIsComplete()) {
                console.log('Level Complete! You deserve a cookie');
            }
        }
    };

    Game = function() {
        this.map;
        this.currentMapData;

        Crafty.init([
            conf.GAME_WIDTH * conf.TILE,
            conf.GAME_HEIGHT * conf.TILE
        ]);
        Crafty.sprite(conf.TILE, '/images/skb/sprites.png', {
            player: [0, 0],
            wall: [0, 1],
            block: [1, 0],
            gate: [0, 2],
            goal: [2, 0]
        });
    };
    Game.prototype = {
        loadLevel: function(levelNum) {
            var name = 'level' + levelNum,
                map = new Map();

            if (Crafty._scenes[name]) {
                // already loaded
                Crafty.scene(name);
                return;
            }

            $.get(name + '.json', $.proxy(function(data) {
                Crafty.scene(name, function() {
                    map.deserializeLevel(data);
                });
                this.currentMapData = data;
                Crafty.scene(name);
            }, this), 'json')
            .error(function() {
                if (!console || !console.log) { return; }
                console.log('Error loading level: ' + name + '.json');
            });

            this.map = map;
        }
    };

    init = function() {
        var game = new Game();
        game.loadLevel(1);
        SKB.game = game;
    };

    return {
        init: init,
        Game: Game,
        Map: Map
    }
})(SKB);

window.onload = function() {
    SKB.core.init();
}
