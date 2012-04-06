/**
 * Four-way moving entity, which snaps to a grid position when at rest
 *
 * Entity will move based on a key press.  When the key is released, entity
 * will continue moving until reaching a position that is an even multiple
 * of the given gridSize.
 */
Crafty.c("fourwaysnap", {
    _speed: 4,
    _gridSize: 32,
    _motion: 0, // 0 = stopped; 1-4 = up, right, down, left
    _ticksPerSnap: 8,
    _ticksRemaining: 0,
    _nextSnapPos: null,
    _lastSnapPos: null,

    init: function() {
        if(!this.has("controls")) {
            this.addComponent("controls");
        }
    },

    fourwaysnap: function(speed, gridSize) {
        if(speed) {
            this._speed = speed;
        }
        if (gridSize) {
            this._gridSize = gridSize;
            this._ticksPerSnap = gridSize / this._speed;
        }


        this.bind("EnterFrame", function() {
            var old = this.pos(),
                changed = false;

            if (this._motion && this._ticksRemaining === 1) {
                // final frame -- don't step past landing tile
                this.x = this._nextSnapPos.x,
                this.y = this._nextSnapPos.y
                this._ticksRemaining = 0;
                this._motion = 0;

                if (typeof this.afterMove === 'function') {
                    this.afterMove();
                }
            } else if(this._motion) {
                // up
                if (this._motion === 1) {
                    this.y -= this._speed
                    changed = true;
                }
                // right
                if (this._motion === 2) {
                    this.x += this._speed;
                    changed = true;
                }
                // down
                if (this._motion === 3) {
                    this.y += this._speed;
                    changed = true;
                }
                // left
                if (this._motion === 4) {
                    this.x -= this._speed;
                    changed = true;
                }
                
                this._ticksRemaining--;
            }

        });

        return this;
    },

    moveUp: function() {
        this._moveToPosition(1, this.x, this.y - this._gridSize);
    },

    moveRight: function() {
        this._moveToPosition(2, this.x + this._gridSize, this.y);
    },

    moveDown: function() {
        this._moveToPosition(3, this.x, this.y + this._gridSize);
    },

    moveLeft: function() {
        this._moveToPosition(4, this.x - this._gridSize, this.y);
    },

    getCoords: function() {
        return {
            x: this.x,
            y: this.y,
            c: Math.floor(this.x / this._gridSize),
            r: Math.floor(this.y / this._gridSize)
        };
    },

    _moveToPosition: function(direction, x, y) {
        if (this._motion) {
            return;
        }

        if (typeof this.beforeMove === 'function') {
            this.beforeMove();
        }

        this._motion = direction;
        this._nextSnapPos = {
            x: x,
            y: y
        }
        this._lastSnapPos = {
            x: this.x,
            y: this.y
        };
        this._ticksRemaining = this._ticksPerSnap;
    },

    /**
     * Prevent current movement and return object to it's previous snap position
     */
    stop: function() {
        this._motion = 0;
        this._ticksRemaining = 0;
        if (this._lastSnapPos) {
            this.x = this._lastSnapPos.x;
            this.y = this._lastSnapPos.y;
        }
    }
});

Crafty.c("PlayerControls", {
    __move: {left: false, right: false, up: false, down: false},

    init: function() {
        if (!this.has("Collision")) {
            this.addComponent("Collision");
        }
        if (!this.has('fourwaysnap')) {
            this.addComponent('fourwaysnap');
        }
        var move = this.__move;
        
        this.bind("EnterFrame", function() {
            if (this._motion) {
                return;
            }

            // move entity based on active input
            if(move.up) {
                this.tryMoveUp();
            }
            if(move.right) {
                this.tryMoveRight();
            }
            if(move.down) {
                this.tryMoveDown();
            }
            if(move.left) {
                this.tryMoveLeft();
            }
        }).bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.RIGHT_ARROW ||
              e.keyCode === Crafty.keys.D) {
                move.right = true;
            }
            if (e.keyCode === Crafty.keys.LEFT_ARROW ||
              e.keyCode === Crafty.keys.A) {
                move.left = true;
            }
            if (e.keyCode === Crafty.keys.UP_ARROW ||
              e.keyCode === Crafty.keys.W) {
                move.up = true;
            }
            if (e.keyCode === Crafty.keys.DOWN_ARROW ||
              e.keyCode === Crafty.keys.S) {
                move.down = true;
            }
        }).bind("KeyUp", function(e) {
            if (e.keyCode === Crafty.keys.RIGHT_ARROW ||
              e.keyCode === Crafty.keys.D) {
                move.right = false;
            }
            if (e.keyCode === Crafty.keys.LEFT_ARROW ||
              e.keyCode === Crafty.keys.A) {
                move.left = false;
            }
            if (e.keyCode === Crafty.keys.UP_ARROW ||
              e.keyCode === Crafty.keys.W) {
                move.up = false;
            }
            if (e.keyCode === Crafty.keys.DOWN_ARROW ||
              e.keyCode === Crafty.keys.S) {
                move.down = false;
            }
        });
    },

    tryMoveUp: function() {
        var current = this.getCoords(),
            next    = { c: current.c, r: current.r - 1 },
            second  = { c: current.c, r: current.r - 2 },
            pushBlock = false;

        this._tryMove('Up', current, next, second);
    },

    tryMoveRight: function() {
        var current = this.getCoords(),
            next    = { c: current.c + 1, r: current.r },
            second  = { c: current.c + 2, r: current.r },
            pushBlock = false;

        this._tryMove('Right', current, next, second);
    },

    tryMoveDown: function() {
        var current = this.getCoords(),
            next    = { c: current.c, r: current.r + 1 },
            second  = { c: current.c, r: current.r + 2 },
            pushBlock = false;

        this._tryMove('Down', current, next, second);
    },

    tryMoveLeft: function() {
        var current = this.getCoords(),
            next    = { c: current.c - 1, r: current.r },
            second  = { c: current.c - 2, r: current.r };

        this._tryMove('Left', current, next, second);
    },

    _tryMove: function(direction, current, next, second) {
        var pushBlock,
            nextBlock;

        if (this._canMove(current, next)) {
           this['move' + direction]();
        } else if (pushBlock = this._canPush(current, next, second)) {
            nextBlock = SKB.util.tileAt(second.c, second.r);
            push = pushBlock['move' + direction];
            this['move' + direction]();
            pushBlock.z = 1;
            nextBlock.z = 0;
            pushBlock['move' + direction]();

            var opposites = {
                'Left': 'Right',
                'Right': 'Left',
                'Up' : 'Down',
                'Down': 'Up'
            }
            nextBlock['move' + opposites[direction]]();
        }
    },

    _canMove: function(from, to) {
        // can step onto block of same color...
        if (SKB.util.blocksMatch(from, to)) {
            return true;
        }
        // ...or to/from a gate
        var fromTile = SKB.util.tileAt(from.c, from.r);
        if (fromTile && fromTile.has('gate')) {
            return true;
        }
        var toTile = SKB.util.tileAt(to.c, to.r);
        if (toTile && toTile.has('gate')) {
            return true;
        }

        return false;
    },

    // returns the block to push if it is pushable, false otherwise
    _canPush: function(from, to, next) {
        if (!SKB.util.blocksMatch(from, next)) {
            return false;
        }

        var pushBlock = SKB.util.tileAt(to.c, to.r);

        if (pushBlock && pushBlock.has('Block')) {
            return pushBlock;
        }

        return false;
    }
});

Crafty.c("Block", {

    gamemap: undefined,

    init: function() {
        if (!this.has("fourwaysnap")) {
            this.addComponent("fourwaysnap");
        }
        if (!this.has("Collision")) {
            this.addComponent("Collision");
        }
    },

    block: function(map) {
        this.gamemap = map;
    },

    afterMove: function() {
       this.gamemap.checkMapCompletion(); 
    },

    // cycle to the next of three colors
    toggleColor: function() {
        var type;
        if (this.keystone) {
            type = 'keystone';
        } else {
            type = 'block';
        }
        
        if (this.color === SKB.conf.WHITE) {
            this.color = SKB.conf.BLUE;
            this.removeComponent('white' + type);
            this.addComponent('blue' + type);
        } else if (this.color === SKB.conf.BLUE) {
            this.color = SKB.conf.RED;
            this.removeComponent('blue' + type);
            this.addComponent('red' + type);
        } else {
            this.color = SKB.conf.WHITE;
            this.removeComponent('red' + type);
            this.addComponent('white' + type);
        }
    },

    toggleKeystone: function() {
        if (this.keystone) {
            this.keystone = false;

            this.removeComponent(this.color + 'keystone');
            this.addComponent(this.color + 'block');
        } else {
            this.keystone = true;
            this.removeComponent(this.color + 'block');
            this.addComponent(this.color + 'keystone');
        }
    }
});
