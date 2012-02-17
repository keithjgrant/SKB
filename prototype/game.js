/**
 * This is the original working prototype
 *
 * I may have broken a thing or two, but don't mess with it!
 */

var game = (function($) {

var my = {},
    drawer,
    game,
    canvas,
    colors = {
        // http://0to255.com/2f5b8a
        background: '#666666',
        whiteBlock: '#b1cae5',
        blackBlock: '#2f5b8a',
        immobileBlock: '#15293e',
        whiteGoal: '#cbdbed',
        blackGoal: '#264a71',
        player: '#008888',
        ramp: '#666666'
    },
    levels = {
        level1: '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,;0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,;0,0,0,0,0,1,1,2,1,0,0,0,0,0,0,0,;0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,;0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,;0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;5,6',
        level2: '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,2,2,1,2,2d,1b,1,2,1,1,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,2,2,4,2,2,1,1,5,1,1,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,2,2,2,2,2,1,1,1,1,1,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;4,10',
        level3: '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2,1,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2d,1b,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2,1,1,1,1,2,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,2,1,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2,2,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,4,2,1,1,1,1,1,1,0,0,;0,0,0,1,2,1,2,2,1,1,1,2,1,1,0,0,;0,0,0,1,2,2,2,2,1,1,1,1,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;4,5',
        level4: '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2,1,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2d,1b,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2,1,1,1,1,2,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,2,1,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,2,2,1,1,1,1,1,1,0,0,;0,0,0,1,2,2,4,2,1,1,1,1,1,1,0,0,;0,0,0,1,2,1,2,2,1,1,1,2,1,1,0,0,;0,0,0,1,2,2,2,2,1,1,1,1,1,1,0,0,;0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,;4,5',
    },
    messages = {
        level1: "I've seen this game before. I have to push the block over to that target.",
        level2: "There's another block.  But what happens when I step through that portal?",
        level3: "Now how do I get over there?",
    };
    
/**
 * Block object
 */
function Block(x, y, type, ramps) {
    
    
    this.moveUp = function () {
        if (this.ramps[1]) {
            return false;
        }
        
        return this.swapWith(map.blocks[this.x][this.y-1]);
    }
    
    this.moveDown = function() {
        if (this.ramps[3]) {
            return false;
        }
        
        return this.swapWith(map.blocks[this.x][this.y+1]);
    }
    
    this.moveLeft = function() {
        if (this.ramps[0]) {
            return false;
        }
        
        return this.swapWith(map.blocks[this.x-1][this.y]);
    }
    
    this.moveRight = function() {
        if (this.ramps[2]) {
            return false;
        }
        return this.swapWith(map.blocks[this.x+1][this.y]);
    }
    
    /**
     * Swap this block's color with another, if possible
     * 
     * returns true if swap successful
     */
    this.swapWith = function(otherBlock) {
        if (otherBlock && otherBlock.type != this.type &&
            this.type !== 'immobile' && otherBlock.type !== 'immobile') {
            var prevColor = this.type;
            this.type = otherBlock.type;
            otherBlock.type = prevColor;
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Toggle the block's color for level editing mode
     */
    this.toggleType = function(toggleGoal) {
        if (toggleGoal) {
            // include goal options
            return this.toggleGoal()
        }

        switch (this.type) {
            case 'immobile': this.type = 'white'; break;
            case 'white': this.type = 'black'; break;
            case 'black': this.type = 'immobile'; break;
        }
    }

    /**
     * Toggle the block's goal type for level editing mode
     */
    this.toggleGoal = function() {
        this.goal++;
        if (this.goal > 2) {
            this.goal = 0;
        }
    }

    this.toggleRamp = function(n) {
        if (n < 0 || n > 3) {
            return;
        }

        if (this.ramps[n]) {
            this.ramps[n] = false;
        } else {
            this.ramps[n] = true;
        }
    }

    this.serialize = function() {
        var code = '';
        // type:
        // 0 - immobile
        // 1 - white
        // 2 - black
        // 3 - white, white goal
        // 4 - white, black goal
        // 5 - black, white goal
        // 6 - black, black goal
        if (this.type === 'immobile') {
            code = 0;
        } else if (this.type === 'white') {
            code = 1;
        } else {
            code = 2;
        }

        code += (this.goal * 2);
        code = String(code);

        // abcd - ramp directions
        if (this.ramps[0]) { code += 'a'; }
        if (this.ramps[1]) { code += 'b'; }
        if (this.ramps[2]) { code += 'c'; }
        if (this.ramps[3]) { code += 'd'; }

        code += ',';
        return code;
    }

    this.deserialize = function(code) {
        switch (code.charAt(0)) {
            case '0':
                this.type = 'immobile';
                this.goal = 0;
                break;

            case '1':
                this.type = 'white';
                this.goal = 0;
                break;

            case '2':
                this.type = 'black';
                this.goal = 0;
                break;

            case '3':
                this.type = 'white';
                this.goal = 1;
                break;

            case '4':
                this.type = 'black';
                this.goal = 1;
                break;

            case '5':
                this.type = 'white';
                this.goal = 2;
                break;

            case '6':
                this.type = 'black';
                this.goal = 2;
                break;
        }

        this.ramps = new Array(4);
        for (var i = 1; i < code.length; i++) {
            switch (code.charAt(i)) {
                case 'a': this.ramps[0] = true; break;
                case 'b': this.ramps[1] = true; break;
                case 'c': this.ramps[2] = true; break;
                case 'd': this.ramps[3] = true; break;
            }
        }
    }

    if (x && !y && !type && !ramps) {
        this.deserialize(x);
    } else {
        this.x = x;
        this.y = y;
        this.type = type;

        this.ramps = new Array();
        for (var i = 0; i < 4; i++) {
            if (ramps[i]) {
                this.ramps[i] = true;
            } else {
                this.ramps[i] = false;
            }
        }
    }
}

/**
 * Player object
 */
function Player(x, y) {
    this.x = Number(x);
    this.y = Number(y);
    
    this.moveLeft = function() {
        this.x--;
    }
    
    this.moveUp = function() {
        this.y--;
    }
    
    this.moveRight = function() {
        this.x++;
    }
    
    this.moveDown = function() {
        this.y++;
    }
}

/**
 * Drawer
 * 
 * element -- canvas jquery element
 */
function Drawer(element) {
    this.element = element;
    this.ctx = element[0].getContext("2d");
    this.width = element.width();
    this.height = element.height();
    
    this.getHeight = function() {
        return this.height;
    }
    
    this.getWidth = function() {
        return this.width;
    }
    
    /**
     * Get pixel position (x) of left side
     */
    this.getLeftOffset = function() {
        return this.element.offset().left;
    }
    
    /**
     * Get pixel position (y) of top side
     */
    this.getTopOffset = function() {
        return this.element.offset().top;
    }
    
    this.setColor = function(color) {
        this.ctx.fillStyle = color;
    }
    
    this.rect = function(x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.fill();
    }

    this.circle = function(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI*2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    this.triangle = function(a, b, c) {
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.lineTo(c.x, c.y);
        this.ctx.lineTo(a.x, a.y);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

/**
 * Map
 * 
 * Draws the game elements
 */
function Map(draw, colors) {
    this.draw = draw;
    this.colors = colors;
    this.blockHeight = draw.getHeight() / 16;
    this.blockWidth = draw.getWidth() / 16;
    this.canvasMinX = draw.getLeftOffset();
    this.canvasMaxX = this.canvasMinX + draw.getWidth();
    this.canvasMinY = draw.getTopOffset();
    this.canvasMaxY = this.canvasMinY + draw.getHeight();
    
    this.clear = function() {
        this.draw.setColor(this.colors.background);
        this.draw.rect(0, 0, this.draw.getWidth(), this.draw.getHeight());
    }
    
    this.drawBlock = function(x, y, type) {
        if (type === 'white') {
            this.draw.setColor(colors.whiteBlock);
        } else if (type === 'black') {
            this.draw.setColor(colors.blackBlock);
        } else {
            this.draw.setColor(colors.immobileBlock);
        }
        this.draw.rect(x*this.blockWidth+1, y*this.blockHeight+1,
            this.blockWidth-2, this.blockHeight-2);
    }

    this.drawGoal = function(x, y, type) {
        if (type === 1 || type === 'white') {
            this.draw.setColor(colors.whiteGoal);
        } else {
            this.draw.setColor(colors.blackGoal);
        }

        this.draw.rect(x*this.blockWidth+10, y*this.blockHeight+10,
            this.blockWidth-20, this.blockHeight-20);
    }

    this.drawPlayer = function(x, y) {
        var tlx = x * this.blockWidth,
            tly = y * this.blockHeight,
            brx = (x+1) * this.blockWidth,
            bry = (y+1) * this.blockHeight,
            cx = (x+.5) * this.blockWidth,
            cy = (y+.5) * this.blockHeight;
        
        var glow = this.draw.ctx.createRadialGradient(
            cx+1, cy+3, 10,
            cx+1, cy+3, 30);
        glow.addColorStop(0, 'rgba(0,0,0,.2)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        this.draw.setColor(glow);
        this.draw.circle(cx+1, cy+3, this.blockWidth/4);
        
        this.draw.setColor(colors.player);
        this.draw.circle(cx, cy, this.blockWidth/4);
        
        var player = this.draw.ctx.createRadialGradient(
            cx-2, cy-2, 1,
            cx, cy, 10);
        player.addColorStop(0, 'rgba(255,255,255,0.3)');
        player.addColorStop(1, 'rgba(255,255,255,0)');
        this.draw.setColor(player);
        this.draw.circle(cx, cy, this.blockWidth/4);
    }
    
    /**
     * Draw triangle to indicate a ramp
     * 
     * direction -- int 0-3 (left, up, right, down)
     */
    this.drawRamp = function(x, y, dir) {
        var one, two, three;
        if (dir === 0 || dir === 1) {
            one = {
                x: x*this.blockWidth,
                y: y*this.blockWidth
            };
        } else {
            one = {
                x: (x+1)*this.blockWidth,
                y: (y+1)*this.blockWidth
            };
        }
        
        if (dir === 1 || dir == 2) {
            two = {
                x: (x+1)*this.blockWidth,
                y: y*this.blockWidth
            };
        } else {
            two = {
                x: x*this.blockWidth,
                y: (y+1)*this.blockWidth
            };
        }
        
        switch (dir) {
            case 0: 
                three = {
                    x: (x+.25)*this.blockWidth,
                    y: (y+.5)*this.blockHeight
                };
                break;
            
            case 1:
                three = {
                    x: (x+.5)*this.blockWidth,
                    y: (y+.25)*this.blockHeight
                };
                break;
                
            case 2:
                three = {
                    x: (x+.75)*this.blockWidth,
                    y: (y+.5)*this.blockHeight
                };
                break;
                
            case 3:
                three = {
                    x: (x+.5)*this.blockWidth,
                    y: (y+.75)*this.blockHeight
                };
                break;
            
            default:
                return;
                break;
        }
        
        this.draw.setColor(colors.ramp);
        this.draw.triangle(one, two, three);
    }
    
    /**
     * Get the game coordinates from pixel coordinates
     */
    this.getCoordinates = function(pixelX, pixelY) {
        if (pixelX < this.canvasMinX || pixelX > this.canvasMaxX) {
            return false;
        }
        
        if (pixelY < this.canvasMinY || pixelY > this.canvasMaxY) {
            return false;
        }
        
        // how close to the line a click must be to register as a line click
        var threshold = 0.2;
        var x = (pixelX - this.canvasMinX) / this.blockWidth + threshold;
        var y = (pixelY - this.canvasMinY) / this.blockHeight + threshold;

        // see if click is near border or in center
        var roundX = Math.floor(x);
        var roundY = Math.floor(y);
        var location = {
            x: roundX,
            y: roundY
        }
        if (x - roundX < threshold) {
            location.isVRamp = true;
        } else if (y - roundY < threshold) {
            location.isHRamp = true;
        }
        
        return location;
    }
    
}

/**
 * Game state
 * 
 * Draws the map, controls player movement
 */
function Game(blocks, player, map) {
    this.blocks = blocks;
    this.player = player;
    this.map = map;
    this.editMode = true;
    this.shiftDepressed = false;
    
    this.begin = function() {
        this.drawMap();
        $(document).keydown(this.onKeyDown);
        $(document).keyup(this.onKeyUp);
        $(document).mouseup(this.onClick);
    }
    
    var self = this;
    this.onKeyDown = function(event) {
        if (event.keyCode === 37) {
            self.moveLeft();
        } else if (event.keyCode === 38) {
            self.moveUp();
        } else if (event.keyCode === 39) {
            self.moveRight();
        } else if (event.keyCode === 40) {
            self.moveDown();
        } else if (event.keyCode === 16) {
            self.shiftDepressed = true;
        }
        self.drawMap();
        self.testLevelCompletion();
    }

    this.onKeyUp = function(event) {
        if (event.keyCode === 16 || (event.keyCode === 0 && event.shiftKey)) {
            self.shiftDepressed = false;
        }
    }
    
    this.onClick = function(event) {
        if (!self.editMode) {
            return;
        }

        var coords = self.map.getCoordinates(event.pageX, event.pageY);
        if (!coords) {
            return;
        }

        if (coords.isHRamp) {
            self.blocks[coords.x][coords.y].toggleRamp(1);
            self.blocks[coords.x][coords.y-1].toggleRamp(3);
        } else if (coords.isVRamp) {
            self.blocks[coords.x][coords.y].toggleRamp(0);
            self.blocks[coords.x-1][coords.y].toggleRamp(2);
        } else {
            self.blocks[coords.x][coords.y].toggleType(self.shiftDepressed);

        }
        self.drawMap();
        self.writeLevelCode();
    }
    
    
    this.drawMap = function() {
        this.map.clear();
        
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
                this.map.drawBlock(x, y, this.blocks[x][y].type);
                if (this.blocks[x][y].goal) {
                    this.map.drawGoal(x, y, this.blocks[x][y].goal);
                }
                
                for (var i = 0; i < 4; i++) {
                    if (this.blocks[x][y].ramps[i]) {
                        this.map.drawRamp(x, y, i);
                    }
                }
            }
        }
        
        this.map.drawPlayer(player.x, player.y);
    }

    /**
     * Display the level code
     */
    this.writeLevelCode = function() {
        var code = '';
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
                code += this.blocks[x][y].serialize();
            }
            code += ';';
        }
        code += this.player.x + ',' + this.player.y;

        var div = $("#level-code");
        div.html(code);
    }
    
    this.moveLeft = function() {
        var x = player.x;
        var y = player.y;
        
        if (!this.blocks[x-1]) {
            return false;
        }
        
        if (this.blocks[x][y].type === this.blocks[x-1][y].type ||
            this.rampLeft() ||
            this.pushLeft()) {
                
            this.player.moveLeft();
            return true;
        }
    }
    
    this.moveUp = function() {
        var x = player.x;
        var y = player.y;
        
        if (!this.blocks[x][y-1]) {
            return false;
        }
        
        if (this.blocks[x][y].type === this.blocks[x][y-1].type ||
            this.rampUp() ||
            this.pushUp()) {
                
            this.player.moveUp();
            return true;
        }
    }
    
    this.moveRight = function() {
        var x = player.x;
        var y = player.y;
        
        if (!this.blocks[x+1]) {
            return false;
        }
        
        if (this.blocks[x][y].type === this.blocks[x+1][y].type ||
            this.rampRight() ||
            this.pushRight()) {
                
            this.player.moveRight();
            return true;
        }
    }
    
    this.moveDown = function() {
        var x = player.x;
        var y = player.y;
        
        if (!this.blocks[x][y+1]) {
            return false;
        }
        
        if (this.blocks[x][y].type === this.blocks[x][y+1].type ||
            this.rampDown() ||
            this.pushDown()) {
                
            this.player.moveDown();
            return true;
        }
    }
    
    this.rampLeft = function() {
        return this.blocks[player.x][player.y].ramps[0];
    }
    
    this.rampUp = function() {
        return this.blocks[player.x][player.y].ramps[1];
    }
    
    this.rampRight = function() {
        return this.blocks[player.x][player.y].ramps[2];
    }
    
    this.rampDown = function() {
        return this.blocks[player.x][player.y].ramps[3];
    }
    
    this.pushLeft = function() {
        var x = player.x;
        var y = player.y;
        
        if (this.blocks[x-1] === undefined ||
            this.blocks[x-2] === undefined) {
            return false;
        }
        
        return this.push(
            this.blocks[x][y],
            this.blocks[x-1][y],
            this.blocks[x-2][y]);
    }
    
    this.pushUp = function() {
        var x = player.x;
        var y = player.y;
        
        if (this.blocks[x][y-1] === undefined ||
            this.blocks[x][y-2] === undefined) {
            return false;
        }
        
        return this.push(
            this.blocks[x][y],
            this.blocks[x][y-1],
            this.blocks[x][y-2]);
    }
    
    this.pushRight = function() {
        var x = player.x;
        var y = player.y;
        
        if (this.blocks[x+1] === undefined ||
            this.blocks[x+2] === undefined) {
            return false;
        }
        
        return this.push(
            this.blocks[x][y],
            this.blocks[x+1][y],
            this.blocks[x+2][y]);
    }
    
    this.pushDown = function() {
        var x = player.x;
        var y = player.y;
        
        if (this.blocks[x][y+1] === undefined ||
            this.blocks[x][y+2] === undefined) {
            return false;
        }
        
        return this.push(
            this.blocks[x][y],
            this.blocks[x][y+1],
            this.blocks[x][y+2]);
    }
    
    /**
     * Push a block, if possible
     * 
     * Push a block from "from" to "to", with player at position "current"
     * 
     * returns true | false
     */
    this.push = function(current, from, to) {
        if (!current || !from || !to) {
            return false;
        }
        
        if (current.type === to.type && from.type !== to.type &&
            to.type !== 'immobile' && from.type !== 'immobile') {
            var prevType = from.type;
            from.type = to.type;
            to.type = prevType;
            return true;
        }
        
        return false;
    }
    
    
    /**
     * Check if level is completed
     * 
     * return true | false
     */
    this.levelCompleted = function() {
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
            }
        }
    }
}


my.init = function(selector) {
    canvas = $(selector);
    drawer = new Drawer(canvas);
    
    my.loadLevel('level3');

    $("a.level").click(function() {
        my.loadLevel($(this).attr('id'))
    });
}

my.loadLevel = function(level) {
    if (!levels[level]) {
        return;
    }

    var levelData = levels[level];
    var rows = levelData.split(';');
    var rowBlocks;

    var blocks = new Array();
    for (var x = 0; x < 16; x++) {
        blocks[x] = new Array();
        rowBlocks = rows[x].split(',');
        for (var y = 0; y < 16; y++) {
            blocks[x][y] = new Block(rowBlocks[y]);
        }
    }
    var playerLoc = rows[16].split(',');
    
    var player = new Player(playerLoc[0], playerLoc[1]);
    var map = new Map(drawer, colors);
    
    game = new Game(blocks, player, map);
    
    if (messages[level]) {
        displayMessage(messages[level]);
    } else {
        hideDisplayMessage();
    }
    
    game.begin();
}

displayMessage = function(text) {
    var div = $("#level-message");
    
    if (div.size() == 0) {
        div = $('<div>');
        div.attr('id', 'level-message');
        div.css({
            backgroundColor: colors.immobileBlock,
            color: colors.whiteBlock,
            position: 'absolute',
            padding: '10px',
            margin: '10px',
            border: '2px solid ' + colors.blackBlock,
            left: 0,
            top: 0
        });
        canvas.before(div);
    } else {
        div.show();
    }
    
    div.html(text);
}

hideDisplayMessage = function() {
    $('#level-message').hide();
}

return my;


})(jQuery);

$(document).ready(function() {    
    game.init('#game');    
});
