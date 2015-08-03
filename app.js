// ����������� ����������� �������
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var es = require('elasticsearch'); // ������� ��� elasticsearch
var config = require('./config');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// ����������������
var port = process.env.PORT || 8080;
app.set('appSecret', config.appSecret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ����� �������� � �������
app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ������������� � ��������� ��������� ��� /api
var api = express.Router();
api.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

var esClient = new es.Client({
	host: config.connectionStrings.es,
	//log: 'trace',
	apiVersion: '1.6'
});

(function () {
	// ��������� ��������� ��� /api/posts/*
	require('./routes')(api, esClient);
})();

// ���������� ������������ ��������
app.use('/api', function (req, res, next) {
	req.es = esClient;
	next();
});
app.use('/api', api);

// �������!
app.listen(port);
console.log('es-svr started at http://localhost:' + port);
