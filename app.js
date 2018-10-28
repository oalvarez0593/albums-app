'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
//CARGA DE RUTAS
var album_routes = require('./routes/album');
var image_routes = require('./routes/image');
//BODY PARSER, PARSEAR A JSON
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
//CONFIGURACIÓN DE CABECERAS.
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Request-Method');
  response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
//CONFIGURACIONES DE RUTAS Y CONTROLADORES
app.use('/', express.static('client', {redirect:false}));
app.use('/api', album_routes);
app.use('/api', image_routes);

app.get('*', function(req, res, next){
	res.sendFile(path.resolve('client/index.html'));
});

module.exports = app;