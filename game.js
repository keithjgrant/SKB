/**
 * SKB - A sokoban-inspired game
 * Author: Keith J Grant
 * keithjgrant@gmail.com
 */

if (typeof SKB === 'undefined') {
    var SKB = {}
}

SKB.conf = {
    GAME_TICK:      30, // game cycles per second?
    TILE:           32,
    GAME_WIDTH:     16,
    GAME_HEIGHT:    12
}

SKB.game = function() {
    var conf = SKB.conf;
    Crafty.init([
        conf.GAME_WIDTH * conf.TILE,
        conf.GAME_HEIGHT * conf.TILE
    ]);
    Crafty.sprite(conf.TILE, 'sprites.png', {
        player: [0, 0],
        wall: [0, 1],
        block: [0, 1], // TODO
        darkBlock: [0, 2],
        lightBlock: [0, 3]
    });
};
SKB.game.prototype = {
    loadLevel: function(levelNum) {
        var name = 'level' + levelNum,
            map = new SKB.map();

        if (Crafty._scenes[name]) {
            // already loaded
            Crafty.scene(name);
            return;
        }

        $.get(name + '.json', function(data) {
            Crafty.scene(name, function() {
                map.deserializeLevel(data);
            });
            Crafty.scene(name);
        }, 'json')
        .error(function() {
            if (!console || !console.log) { return; }
            console.log('Error loading level: ' + name + '.json');
        });
    }
};

SKB.map = function() {
    this.loader = new SKB.entityLoader();
};
SKB.map.prototype = {
    /*
     *  SERIALIZED MAP FORMAT:
     *  tiles: 16x12 array of:
     *  0 - wall
     *  1 - dark block
     *  2 - dark loop block
     *  3 - light block
     *  4 - light loop block
     *
     *  goals: {type:<0/1>,c,r}
     *  gates {orientation:<0-3>,c,r}
     *  player: {c, r}
     */
    deserializeLevel: function(data) {
        Crafty.scene(name, $.proxy(function() {
            for (r = 0; r < SKB.conf.GAME_HEIGHT; r++) {
                for (c = 0; c < SKB.conf.GAME_WIDTH; c++) {
                    if (data.tiles[r] && data.tiles[r][c]) {
                        this.deserializeTile(c, r, data.tiles[r][c]);
                    } else {
                        this.deserializeTile(c, r, 0);
                    }
                }
            }

            for (i in data.goals) {
                this.addGoal(data.goals[i]);
            }
            for (j in data.gates) {
                this.addGate(data.gates[j]);
            }
            this.loader.player(data.player.c, data.player.r);
                    
        }, this));
        Crafty.scene(name);
    },

    deserializeTile: function(c, r, tile) {
        if (tile == 0) {
            this.loader.wall(c, r);
        } else if (tile == 1) {
            this.loader.block(c, r);
        } else if (tile == 2) {
            this.loader.goalBlock(c, r);
        }
    },

    serializeTile: function() {
        console.log("map.serializeTile() not yet implemented");
    },

    addGoal: function(def) {
    },

    addGate: function(def) {
    }
};

window.onload = function() {
    var game = new SKB.game();
    game.loadLevel(1);
}
