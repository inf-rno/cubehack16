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
    
    app.put('/devices/:id/sensor', function (req, res) {
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
})();
