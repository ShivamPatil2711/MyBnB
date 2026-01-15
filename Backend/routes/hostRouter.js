const express = require('express');
const homesController = require('../controllers/hostController');
const hostrouter = express.Router();
hostrouter.post('/api/host/airbnb-home', homesController.postAddHome);
hostrouter.get('/api/host/host-homes', homesController.getHostHome);
hostrouter.get('/api/host/edithome/:homeId', homesController.getEditHome);
hostrouter.post('/api/host/edithome', homesController.postEditHome);
hostrouter.post('/api/host/deletehome/:homeId', homesController.postDeleteHome);
hostrouter.get('/api/host/booked-homes', homesController.getBookedHomes);

exports.hostrouter = hostrouter;