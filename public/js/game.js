    var font;


class GridParser{
    constructor(tilemap, colormap, actionmap, lightMap, collisionMap){

    }
}

class Util{
    constructor(){

    }

    makeBorder(arr){
        for(var i = 0; i < arr.length; i++) {
            var screenLine = arr[i];
            for(var j = 0; j < screenLine.length; j++) {
                 if(i == 0 && j == 0){
                    arr[i][j] = '╔'
                }
                else if(i == 0 && j == screenLine.length - 1){
                    arr[i][j] = '╗'
                }
                else if(j == 0 && i == arr.length - 1){
                    arr[i][j] = '╚'
                }
                else if(j == screenLine.length -1 && i == arr.length -1){
                    arr[i][j] = '╝'
                }
                else if(i == 0){
                    arr[i][j] = '═'
                }
                else if(i == arr.length - 1){
                    arr[i][j] = '═'
                }
                else if(j == 0){
                    arr[i][j] = '║'
                }
                else if(j == screenLine.length - 1){
                    arr[i][j] = '║'
                }


            }
        }   

        return arr;
    } 

    fill(arr, char){
        var retarr = new Grid(arr[0].length, arr.length);
        for(var i = 0; i < arr.length; i ++){
            for(var j = 0; j < arr[0].length; j ++){
                retarr[i][j] = char;
            }
        }

        return retarr;
    }

    makeTitle(title, arr){
        var titlearr = title.split('');
        var startPos = Math.round((arr[0].length - titlearr.length) / 2);
        for(var i = 0; i < title.split('').length; i++){
            arr[0][startPos] = title.split('')[i]
            startPos++
        }
        return arr;
    }

    makeText(text, x, y, arr){

    }

    makeDungeon(x, y){
        return new Dungeon(x, y)
    }

    makeWindowContent(arr, content){
        var width = arr[0].length - 2;
        var height = arr.length - 2;
        var x_pos = 1
        var y_pos = 1

        for(var i = 1; i < height; i++) {
            y_pos++
            var line = this.grid[i];
            for(x_pos;x_pos < width; x_pos++) {
                x_pos ++
                
            }
        }

    }

    appendSprite(x,y, arr, sprite){
        var arrheight = arr[0].length
        var arrwidth = arr.length
        var spriteheight = sprite[0].length
        var spritewidth = sprite.length

        var startX = x;
        var startY = y;
        var endX = spritewidth + x;
        var endY = spriteheight + y;

        //console.log(`startX: ${startX} startY: ${startY} endX: ${endX} endY: ${endY}`)

        for(var i = startY; i < endY; i++){
            for(var j = startX; j < endX; j++){
                arr[j][i] = sprite[j - x][i - y]
            }
        }

        return arr;
    }

    bsp(arr, opts){
        var direction = (opts) ? opts.direction : 'x';
        var position = (opts) ? opts.position : [randRange(0, arr[0].length), randRange(0, arr.length)]

        //console.log(direction)
        //console.log(position)


    }

    findingNeighbors(i, j, grid) {
        var rowLimit = grid.length-1;
        var columnLimit = grid[0].length-1;
    
        var neighbors = []
      
        for(var x = Math.max(0, i-1); x <= Math.min(i+1, rowLimit); x++) {
          for(var y = Math.max(0, j-1); y <= Math.min(j+1, columnLimit); y++) {
            if(x !== i || y !== j) {
              neighbors.push(grid[x][y])
            }
          }
        }
        return neighbors
    }

    randomize(grid, values){
        for(var indexX in grid[0]){
            for(var indexY in grid){
                grid[indexX][indexY] = values[randRange(0, values.length)]
            }
        }

        return grid;
    }

    CellularAutomata(grid, steps){
        var grid = grid;
        var width = grid[0].length
        var height = grid.length
        var retarr = new Grid(width, height)
        var overPop = 4;


        for(var iteration = 0; iteration < steps; iteration++){
            for(var i = 0; i < height; i++) {
                var line = grid[i];
                for(var j = 0; j < width; j++) {
                    var neighbors = getOccurrence(this.findingNeighbors(i, j, grid), '•');
                    var alive = '•'
                    var dead = ' '

                    if(grid[j][i] == alive && neighbors < 2){
                        retarr[j][i] = dead
                    }
                    if(grid[j][i] == alive && (neighbors == 2 || neighbors == 3)){
                        retarr[j][i] = alive
                    }
                    if(grid[j][i] == alive && neighbors >= overPop){
                        retarr[j][i] = dead
                    }
                    if(grid[j][i] != alive && neighbors == overPop-1){
                        retarr[j][i] = alive
                    }

                }

                
            }
        }

            return retarr;

            
        
    }
}

class NET_IO{
    //probably put address here
    //I want to check for localhost to denote MASTER client
    constructor(host, netlayer){
        this.host = host;
        this.socket = io.connect(host);
        this.netLayer = netlayer
        console.log(this.socket)
        this.netEntities = {}
        //setInterval(() => {this.update()}, 200)
    }

    getNetEntities(){
        this.socket.emit('getNetEntities', (net_entities) => {
            console.log(JSON.parse(net_entities))
            this.netEntities = net_entities
        })
    }

    sendNetEntities(layer){
        var netEnt = this.netEntities
        console.log(netEnt)
        
        // Convert netEnt array "object" into true JS object
        var trueObject = {}
        for (var prop in netEnt) {
            trueObject[prop] = netEnt[prop]
        }

        var ent = JSON.stringify(trueObject);
        this.socket.emit('sendNetEntities', ent)
    }

    registerEntity(name, entity){
        this.netEntities[name] = entity
        //console.log(this.netEntities)
    }

    update(layer, callback){
        //check host if localhost dont retreive new data only send
        if(this.host == "localhost"){
            this.sendNetEntities(layer)                
        }else{
            this.getNetEntities(layer)
            //console.log(this.netEntities)
        }


        callback(this.netEntities)


    }
}

class PayerControls{
    constructor(player, callback){
        this.callback =callback
        this.KeyboardHelper = { left: 65, up: 87, right: 68, down: 83 };
        this.MouseHelper = {leftClick: 0}
        this.player = player;

        this.keys = {"rightPressed":false, "leftPressed":false, "upPressed":false, "downPressed":false, "mouseLeftPressed":false}
        this.init();
    }

    init(){
        console.log(this.player)
        window.addEventListener('keydown', () => {
            this.keyDownHandler(event);
        }, false);
        window.addEventListener('keyup', () => {
            this.keyUpHandler(event)
        }, false);
        window.addEventListener('mousedown', () => {
            this.mouseDownHandler(event);
        })
        window.addEventListener('mouseup', () => {
            this.mouseUpHandler(event);
        })
        setInterval(() => {this.update(event)}, this.player.tickspeed)
    }

    mouseUpHandler(event){
        if(event.button == this.MouseHelper.leftClick){
            this.keys.mouseLeftPressed = false;
        }
    }

    mouseDownHandler(event){
        if(event.button == this.MouseHelper.leftClick){
            this.keys.mouseLeftPressed = true;
        }
    }

    keyDownHandler(event){
        console.log(event)
        //if(event.keyCode == this.KeyboardHelper.right && )
        if(event.keyCode == this.KeyboardHelper.right) {
            this.keys.rightPressed = true;
        }
        else if(event.keyCode == this.KeyboardHelper.left) {
            this.keys.leftPressed = true;
        }
        if(event.keyCode == this.KeyboardHelper.down) {
            this.keys.downPressed = true;
        }
        else if(event.keyCode == this.KeyboardHelper.up) {
            this.keys.upPressed = true;
        }
        //this.update()
    }

    keyUpHandler(event){
        if(event.keyCode == this.KeyboardHelper.right) {
            this.keys.rightPressed = false;
        }
        else if(event.keyCode == this.KeyboardHelper.left) {
            this.keys.leftPressed = false;
        }
        if(event.keyCode == this.KeyboardHelper.down) {
            this.keys.downPressed = false;
        }
        else if(event.keyCode == this.KeyboardHelper.up) {
            this.keys.upPressed = false;
        }
        //this.update()
    }

    update(event){
        
        if(this.keys.upPressed){
            this.player.animate('up')
            this.player.position_offset[0] = this.player.position_offset[0] - this.player.speed;
            this.player.mapPosition[0] = Math.floor(this.player.position[0] + this.player.position_offset[0] / 64) - 1
            //this.player.position[0] = Math.floor(this.player.position[0] + this.player.position_offset[0] / 64) - 1
        
        }
        if(this.keys.downPressed){
            this.player.animate('down')
            this.player.position_offset[0] = this.player.position_offset[0] + this.player.speed;
            this.player.mapPosition[0] = Math.floor(this.player.position[0] + this.player.position_offset[0] / 64) - 1
            //this.player.position[0] = Math.floor(this.player.position[0] + this.player.position_offset[0] / 64) - 1
        }
        if(this.keys.rightPressed){
            this.player.animate('right')
            this.player.position_offset[1] = this.player.position_offset[1] + this.player.speed;
            this.player.mapPosition[1] = Math.floor(this.player.position[1] + this.player.position_offset[1] / 64) - 1
            //this.player.position[1] = Math.floor(this.player.position[1] + this.player.position_offset[1] / 64) - 1
            
        }
        if(this.keys.leftPressed){
            this.player.animate('left')
            this.player.position_offset[1] = this.player.position_offset[1] - this.player.speed;
            this.player.mapPosition[1] = Math.floor(this.player.position[1] + this.player.position_offset[1] / 64) - 1
            //this.player.position[1] = Math.floor(this.player.position[1] + this.player.position_offset[1] / 64) - 1
        }

        console.log(this.player.mapPosition)
        this.callback(this.keys)

    }
    
}

class PlayerCamera{
    constructor(following, layer,  rendersizeX, rendersizeY){
        this.following = following;
        this.layer = layer;
        this.rendersizeX = rendersizeX;
        this.rendersizeY = rendersizeY;
    }

    update(){
        var following = this.following;
        var layer = this.layer
        var rendersizeX = this.rendersizeX;
        var rendersizeY = this.rendersizeY

        var startY = (following.mapPosition[0] - rendersizeY / 2 > 0) ? following.mapPosition[0] - rendersizeY / 2: 0;
        var startX = (following.mapPosition[1] - rendersizeX / 2 > 0) ? following.mapPosition[1] - rendersizeX / 2: 0;
        return this.layer.snapshot(startX, startY, rendersizeX, rendersizeY)   
    }

    getMouseCoords(mousePos){
        var following = this.following;
        var rendersizeX = this.rendersizeX;
        var rendersizeY = this.rendersizeY;
        var startY = (following.mapPosition[0] - rendersizeY / 2 > 0) ? following.mapPosition[0] - rendersizeY / 2: 0;
        var startX = (following.mapPosition[1] - rendersizeX / 2 > 0) ? following.mapPosition[1] - rendersizeX / 2: 0;

        return [startX + mousePos[0] - 1, startY + mousePos[1] - 1]

    }
}


class Line{
    constructor(startPos, endPos){

            var x1 = startPos[0]
            var x2 = startPos[1]

            var y1 = endPos[0]
            var y2 = endPos[1]

            var retarr = new Grid(x2 - x1, y2 - y1)

            var m_new = 2 * (y2 - y1);
            var slope_error_new = m_new - (x2 - x1);
         
            for (x = x1, y = y1; x <= x2; x++)
            {
                retarr[x][y] = "█"
     
                // Add slope to increment angle formed
                slope_error_new += m_new;
     
                // Slope error reached limit, time to
                // increment y and update slope error.
                if (slope_error_new >= 0)
                {
                    y++;
                    slope_error_new -= 2 * (x2 - x1);
                }
            }
            
        return retarr
    }
}

class Vec2d{
    constructor(x, y){
        this.x = x;
        this.y = y;

        return [x, y];
    }
}

class Grid{
    constructor(x, y){
        var arr = [];
        for (var i=0;i< y;i++){
          var data = [];
          for (var j=0;j< x;j++){
            data.push(" ");
          }
          arr.push(data);
        }
        return(arr)
    }
}

class Layer{
    constructor(px, py, x, y, game){
        console.log(game)
        this.game_context = game;
        this.x = x;
        this.y = y;
        var util = new Util();
        this.position = [px, py]
        this.position_offset = [0, 0]
        this.grid = new Grid(x, y)
        this.blankGrid = new Grid(x, y);
        this.entities = {};
    }

    add(entity){
        this.entities.push(entity)
    }

    registerEntity(name, entity){
        this.entities[name] = entity
    }

    update(){
        this.grid = new Grid(this.x, this.y)
        for(var index in this.entities) {
            this.updateLayer(this.entities[index])
          }
    }

    updateLayer(layer){

            var drawPosX = 0;
            var drawPosY = 0;
            for(var i = 0; i < layer.grid.length; i++) {
                var screenLine = layer.grid[i];
                for(var j = 0; j < screenLine.length; j++) {
                    drawPosX = j * this.game_context.fontX + (layer.position[1] * this.game_context.fontX) + layer.position_offset[1];
                    drawPosY = i * this.game_context.fontY + (layer.position[0] * this.game_context.fontY) + layer.position_offset[0];
                    if(layer.grid[i][j] == ' '){

                    }else{
                        font.drawChar(layer.grid[i][j], drawPosX, drawPosY, undefined, this.game_context)
                    }
                    
                }
            }

    }

    snapshot(x, y, w, h){
        return this.grid.slice(y, y + h).map(a => a.slice(x, x + w))
    }
}

class Sprite{
    constructor(pos_data){
        this.pos_data = pos_data;
        return this.pos_data;
    }
}

class EntityManager{
    constructor(){
        this.entities = [];
    }

    register(){

    }
}

class Entity2{
    constructor(name, opts){
        this.mapPosition = opts.position
        this.position_offset = opts.position_offset;
        this.position = opts.position
        this.grid = opts.grid;
        this.actions = opts.actions;
        this.speed = opts.speed;
        this.tickspeed = opts.tickSpeed;
        this.animated = opts.animated;
        this.animationFrames = opts.animationFrames;
    }

    setAnimationFrames(){

    }



    animate(frame){
        console.log(frame)
        console.log(this.animationFrames)
        this.grid = util.appendSprite(0, 0, this.grid, this.animationFrames[frame])
        
    }
}



class Entity{
    constructor(px, py, grid){
        this.mapPosition = [px, py]
        this.position_offset = [0, 0]
        this.position = [px, py]
        this.grid = grid;
        this.actions = []
        this.speed = 4;
        this.tickspeed = 16;
        this.animationFrames = {
            right: new Sprite([['skeleton_right_1'],['skeleton_right_2']]),
            left:new Sprite([['skeleton_left_1'],['skeleton_left_2']]), 
            down:new Sprite([['skeleton_down_1'],['skeleton_down_2']]),
            up:new Sprite([['skeleton_up_1'],['skeleton_up_2']]),

           
        };
    }

    setAnimationFrames(){

    }



    animate(frame){
        console.log(frame)
        console.log(this.animationFrames)
        this.grid = util.appendSprite(0, 0, this.grid, this.animationFrames[frame])
        
    }

    show(){
        this.grid = this.prevGrid
    }

    hide(){
        this.prevGrid = this.grid
        this.grid = []
    }

}

class Game{

    constructor(){
        this.canvas = document.getElementById("canvas")
        this.tempCanvas = document.getElementById("temp-canvas")
        this.ctx = this.setupCanvas(this.canvas);
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.fontX = 32;
        this.fontY = 32;
        this.font = new Font('img/atlas2.png',{
                                                'grass1':{
                                                    "position": [0, 5],
                                                    "color": 3
                                                },
                                                'grass2':{
                                                    "position": [3, 4],
                                                    "color": 3
                                                },
                                                'rock':{
                                                    "position": [1, 4],
                                                    "color": 3
                                                },
                                                'bedrock':{
                                                    "position": [0, 4],
                                                    "color": 3
                                                },
                                                'skeleton_right_1':{
                                                    "position": [7, 0],
                                                },
                                                'skeleton_right_2':{
                                                    "position": [7, 1]
                                                },
                                                'skeleton_left_1':{
                                                    "position": [0, 0],
                                                },
                                                'skeleton_left_2':{
                                                    "position": [0, 1]
                                                },
                                                'skeleton_up_1':{
                                                    "position": [5, 0],
                                                },
                                                'skeleton_up_2':{
                                                    "position": [5, 1]
                                                },
                                                'skeleton_down_1':{
                                                    "position": [2, 0],
                                                },
                                                'skeleton_down_2':{
                                                    "position": [2, 1]
                                                },
                                            });
        font = this.font;
        this.layerGroup = [];
        this.entities = [];
        this.actions = [];
        this.mousePos = [0, 0]
    }



    getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [Math.floor((evt.clientX - rect.left ) / this.fontX), Math.floor((evt.clientY - rect.top) / this.fontY)]
    }

    setupCanvas(canvas) {
        var scope = this;
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        canvas.addEventListener('mousemove', function(evt) {
            scope.mousePos = scope.getMousePos(canvas, evt)
        }, false);

        return ctx;
    }

    updateLayer(layer){

            var drawPosX = 0;
            var drawPosY = 0;
            for(var i = 0; i < layer.grid.length; i++) {
                var screenLine = layer.grid[i];
                for(var j = 0; j < screenLine.length; j++) {
                    drawPosX = j * this.fontX + (layer.position[0] * this.fontX);
                    drawPosY = i * this.fontY + (layer.position[1] * this.fontY);

                    //all groups will need to eventually be 2d with an extra deminsion in the root arrays so idont have to iterate over 2 2d arrays just one and get the last value... maybe
                    if(layer.grid[i][j] == ' '){

                    }else{
                        this.font.drawChar(layer.grid[i][j], drawPosX, drawPosY, undefined, this)
                    }
                    
                }
            }

    }
}

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}




function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }



(function(exports) {
     

    exports.Grid = Grid;
    exports.Game = Game;
    exports.Entity = Entity;
    exports.NET_IO = NET_IO;
    
})(typeof exports === 'undefined'? this['infector']={} : exports);