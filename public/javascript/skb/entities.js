if (typeof SKB === 'undefined') {
    SKB = {}
}

SKB.entityLoader = function() {}
SKB.entityLoader.prototype = {
    wall: function(c, r) {
        return Crafty.e("2D, DOM, wall")
            .attr(this._attributes(c, r));
    },

    block: function(c, r, color) {
        var b = Crafty.e("2D, DOM, block, fourwaysnap, Collision")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, SKB.conf.TILE);
        b.color = color;
        if (color === SKB.LIGHT) {
            // TODO better place to store these coords?
            b.sprite(1, 1);
        }
    },

    player: function(c, r) {
        var p = Crafty.e("2D, DOM, player, PlayerControls, Collision, fourwaysnap")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, SKB.conf.TILE);

        p.onHit('wall', function() {
            this.stop();
        });

        SKB.player = p;
        return p;
    },

    gate: function(c, r) {
        var gate = Crafty.e("2D, DOM, gate")
            .attr(this._attributes(c, r));

        return gate;
    },

    _attributes: function(c, r) {
        return {
            x: c * SKB.conf.TILE,
            y: r * SKB.conf.TILE,
            w: SKB.conf.TILE,
            h: SKB.conf.TILE
        }
    }
};

