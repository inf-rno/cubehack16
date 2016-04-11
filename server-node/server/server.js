(function() {
  'use strict';
    var express = require('express');
    var bodyParser = require('body-parser');
    var cors = require('cors');
    var app = express();

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    
    var sensors = {};
    var state = "init"
    var winner = "";
    var activePuzzle = null;
    var availablePuzzles = [
                        {type:"scream", attempts: 3, chances: 3}
                        //    {type:"math", question: "1 + 2 * 2  = ??!?", attempts: 2, chances: 2}
                            //{type:"pattern", attempts: 3, chances: 3}
                            //{type:"light", attempts: 3, chances: 3}
                        ];//[{type:"riddle"},];
    var devices = {
        "1":
        {
            hint:"Somewhere in the Lounge",
            name:"Lounge Cube",
            color:"",
            x:0.5,
            y:0.5
        },
    };
    var players = {};
    
    app.get('/', function (req, res) {
        res.send('Hello World')
    });
    
    app.put('/game/:id/', function (req, res) {
        if (typeof req.body.state !== "string")
        {
            res.status(400);
            res.send("{state:string}");
            return;
        }
        if("init|inProgress|done".indexOf(req.body.state) === -1)
        {
            console.log(req.body.state);
            res.status(400);
            res.send("'state = 'init', 'inProgress', 'done'");
            return;
        }
        state = req.body.state;
        if (state === "init")
        {
            for(var key in devices)
            {
                devices[key].color = "";
            }
        }
        res.send('Game state updated '+JSON.stringify(req.body))
    });
    
    function handleRawSensorUpdate(data)
    {
        console.log("Handling raw sensor: "+JSON.stringify(data));
        for(var key in data)
        {
            sensors[key] = data[key];
        }
    }
    
    //process sensor data to find out if the color should change
    function sensorLoop()
    {
        if (state !== "inProgress")
        {
            return;
        }
    
    }

    //process game data to find out if the game is over
    function gameLoop()
    {
        if (state !== "inProgress")
        {
            return;
        }
        var len = 0;
        var max = 0;
        var maxColor = "";
        var colors = {};
        for(var key in devices)
        {
            len++;
            var device = devices[key];
            var color = device.color;
            if (!color || color === ""){continue;}
            colors[color] = colors[color] ? colors[color] : 0;
            colors[color] ++;
            max = Math.max(colors[color], max);
            if (colors[color] === max)
            {
                maxColor = color;
            }
        }
        if (max > len /2)
        {
            state = "done";
            winner = maxColor;
        }
    }
    
    app.put('/devices/:id/sensor', function (req, res) {
        handleRawSensorUpdate(req.body);
        res.send('Sensor updated '+JSON.stringify(req.body))
    });
    
    app.get('/game/:id/',function (req, res)
    {
        res.json({
            state:state, //init, inProgress, done
            winner:winner,
            devices:devices,
            players:players,
            activePuzzle:activePuzzle,
            sensors:sensors
        })
    });
    
    app.post('/game/:id/puzzle',function(req, res){
        //the user found a puzzle box, cue up a random puzzle
        activePuzzle = availablePuzzles[Math.floor(Math.random()*availablePuzzles.length)];
    });
    
    app.post('/game/:id/players', function (req, res) {

        if(typeof req.body.name!=="string" || typeof req.body.color!=="string")
        {
            res.status(400);
            res.send("{name:string,color:string}");
            return;
        }
        players.push({
            name:req.body.name,
            color:req.body.color
        });
        res.send('Added new player '+JSON.stringify(req.body))
    });
    
    
    app.delete('/game/:id/players/:name', function (req, res) {
        res.send('Removed player '+req.params.name);
        delete players[req.params.name];
    });
    
    app.listen(3000);
    
    
    var net = require('net');
    net.createServer(function(socket) {
        var stream="";
        socket.write('Hello, this is TCP\n');
        socket.on('data', function (d) {
            try
            {
                stream+=d;
                while(true)
                {
                    var start = stream.indexOf("{");
                    var end = stream.indexOf("}");
                    if (end === -1){break;}
                    var datum = stream.substring(start, end+1);
                    stream = stream.substring(end+1);
                    handleRawSensorUpdate(JSON.parse(datum)); 
                }
            }
            catch(err)
            {
                console.error("Something went wrong");
                console.error(err);
                try{socket.end();}catch(ignored){}
            }
        });
    }).listen(3001);
    
    setInterval(sensorLoop, 100);
    setInterval(gameLoop, 1000);
})();
