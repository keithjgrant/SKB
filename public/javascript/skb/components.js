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

        if (this._canMove(current, next)) {
            this.moveUp();
        } else if (pushBlock = this._canPush(current, next, second)) {
            var nextBlock = SKB.util.tileAt(second.c, second.r);
            this.moveUp();
            pushBlock.moveUp();
            nextBlock.moveDown();
        }
    },

    tryMoveRight: function() {
        var current = this.getCoords(),
            next    = { c: current.c + 1, r: current.r },
            second  = { c: current.c + 2, r: current.r },
            pushBlock = false;

        if (this._canMove(current, next)) {
            this.moveRight();
        } else if (pushBlock = this._canPush(current, next, second)) {
            var nextBlock = SKB.util.tileAt(second.c, second.r);
            this.moveRight();
            pushBlock.moveRight();
            nextBlock.moveLeft();
        }
    },

    tryMoveDown: function() {
        var current = this.getCoords(),
            next    = { c: current.c, r: current.r + 1 },
            second  = { c: current.c, r: current.r + 2 },
            pushBlock = false;

        if (this._canMove(current, next)) {
            this.moveDown();
        } else if (pushBlock = this._canPush(current, next, second)) {
            var nextBlock = SKB.util.tileAt(second.c, second.r);
            this.moveDown();
            pushBlock.moveDown();
            nextBlock.moveUp();
        }
    },

    tryMoveLeft: function() {
        var current = this.getCoords(),
            next    = { c: current.c - 1, r: current.r },
            second  = { c: current.c - 2, r: current.r },
            pushBlock = false;

        if (this._canMove(current, next)) {
            this.moveLeft();
        } else if (pushBlock = this._canPush(current, next, second)) {
            var nextBlock = SKB.util.tileAt(second.c, second.r);
            this.moveLeft();
            pushBlock.moveLeft();
            nextBlock.moveRight();
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
    init: function() {
        if (!this.has("fourwaysnap")) {
            this.addComponent("fourwaysnap");
        }
        if (!this.has("Collision")) {
            this.addComponent("Collision");
        }
    },

    block: function(map) {
        this.map = map;
    },

    afterMove: function() {
       this.map.checkMapCompletion(); 
    }
});
