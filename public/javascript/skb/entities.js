if (typeof SKB === 'undefined') {
    SKB = {}
}

SKB.entityLoader = function() {
};
SKB.entityLoader.prototype = {
    wall: function(c, r) {
        return Crafty.e("2D, DOM, wall")
            .attr(this._attributes(c, r));
    },

    block: function(c, r) {
        return Crafty.e("2D, DOM, block, fourwaysnap")
            .attr(this._attributes(c, r));
    },

    player: function(c, r) {
        var p = Crafty.e("2D, DOM, player, controls, Collision, fourwaysnap")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, SKB.conf.TILE);
        p.collision()
         .onHit('wall', function() {
            this.stop();
        }).onHit('block', function() {
        });

        return p;
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

