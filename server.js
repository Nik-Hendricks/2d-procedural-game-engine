
const app = require('express')();
const http = require('http').Server(app);
const { Server } = require("socket.io");
const fs = require('fs')
var io;
const infector = require("./public/js/game");


var test = new infector.Grid(10, 10)
console.log(infector.NET_IO)
console.log(test)
console.log(infector)





class GameServer{
    constructor(){
        this.tickSpeed = 50;
        this.init();
        
        //server tick
    }

    setupSocketEvents(){
        io = new Server(81);
        io.on('connection', (socket) =>  {
            console.log(socket);
        })
    }

    serveGame(){
        http.listen(80, () => {
            console.log("listening on 80")
        })
          
          //app.listen(81)
          
        app.get("/js/:file",function(req, res){
            var file = req.param('file');
            res.header({
              'Content-Type': 'text/javascript',
              'Content-Size': getFilesizeInBytes(__dirname + '/public/js/' + file)
            });
            res.sendFile(__dirname + '/public/js/' + file)
          })
        
        app.get("/entity/:entity/",function(req, res){
            var entity = req.param('entity');
            res.header({
              'Content-Type': 'text/javascript',
              'Content-Size': getFilesizeInBytes(`${__dirname}/public/entities/${entity}/main.js`)
            });
            res.sendFile(`${__dirname}/public/entities/${entity}/main.js`)
        })

        app.get("/img/:file",function(req, res){
            var file = req.param('file')
            res.header({
              'Content-Type': 'image/png',
              'Content-Length': getFilesizeInBytes(__dirname + '/public/img/' + file)
            });
            res.sendFile(__dirname + '/public/img/'+file)
        })
        
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/game.html')
        })
        
        app.get('/2', (req, res) => {
            res.sendFile(__dirname + '/public/game2.html')
        })
        
        app.get('/3', (req, res) => {
          res.sendFile(__dirname + '/public/game3.html')
        })
        
        app.get('/4', (req, res) => {
          res.sendFile(__dirname + '/public/game4.html')
        })

        app.get('/creator', (req, res) => {
          res.sendFile(__dirname + '/public/creator.html');
        })
          
          
          
          
          
    }

    init(){
        setInterval(() => {
            this.update();
        }, this.tickSpeed);

        this.serveGame();
        this.setupSocketEvents();

    }

    update(){
        console.log("update");
    }
}

new GameServer();


function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}