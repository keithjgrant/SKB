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

SKB.init = function() {
    var conf = SKB.conf;
    Crafty.init([conf.GAME_WIDTH * conf.TILE, conf.GAME_HEIGHT * conf.TILE]);

    Crafty.sprite(conf.TILE, 'sprites.png', {
        player: [0, 0],
        tile: [0, 1],
        darkBlock: [0, 2],
        lightBlock: [0, 3]
    });
};

SKB.loadLevel = function(level) {
    var name = 'level' + level;
console.log(Crafty._scenes);
    if (Crafty._scenes[name]) {
        // already loaded
        Crafty.scene(name);
        return;
    }

    $.get(name + '.json', function(data) {
        console.log(data);
        for (r=0; r<SKB.conf.GAME_HEIGHT; r++) {
            for (c=0; c<SKB.conf.GAME_WIDTH; c++) {
                if (data[r] && data[r][c]) {
                    SKB.loadTile(data[r][c]);
                } else {
                    SKB.loadTile('');
                }
            }
        }
                
    });
};

SKB.loadTile = function(data) {
    console.log(data);
};

window.onload = function() {
    SKB.init();

    SKB.loadLevel(1);
}
