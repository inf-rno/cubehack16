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
    
    app.get('/', function (req, res) {
        res.send('Hello World')
    });
    
    app.put('/game/:id/state', function (req, res) {
        res.send('Game state updated '+JSON.stringify(req.body))
    });
    
    function handleRawSensorUpdate(data)
    {
        console.log("Handling raw sensor: "+JSON.stringify(data));
    }
    
    app.put('/devices/:id/sensor', function (req, res) {
        handleRawSensorUpdate(req.body);
        res.send('Sensor updated '+JSON.stringify(req.body))
    });
    
    app.get('/game/:id/',function (req, res)
    {
        res.json({
            state:"ready", //ready, in progress, done
            winner:null,
            map:{
                imgUrl:""
            },
           devices:[
                {
                    hint:"Somewhere in the Lounge",
                    name:"Lounge Cube",
                    color:"green",
                    x:0.5,
                    y:0.5
                },
                {
                    hint:"Printer",
                    name:"Printer Cube",
                    color:"red",
                    x:0.75,
                    y:0.25
                }
           ],
           players:[
                {
                    name:"Vivian",
                    color:"green"
                },
                {
                    name:"David",
                    color:"red"
                }
           ]
        })
    });
    
    app.post('/game/:id/players', function (req, res) {
        res.send('Added new player '+JSON.stringify(req.body))
    });
    
    
    app.delete('/game/:id/players/:name', function (req, res) {
        res.send('Removed player '+req.params.name)
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
})();
