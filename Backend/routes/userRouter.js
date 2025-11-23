const express = require('express');
const userrouter = express.Router();
const homesController = require('../controllers/storeController');
userrouter.get('/api/homes', homesController.getHomes);
userrouter.get('/api/bookings', homesController.getBooking);
userrouter.post('/api/bookings', homesController.postBooking);
userrouter.get('/api/favourite-list', homesController.getFavouritelist);
userrouter.get('/api/homes/:homeId', homesController.getHomesDetails); // Fixed route
userrouter.post('/api/favourites', homesController.postAddToFavourites);
userrouter.post('/api/deletefavourite', homesController.postDeleteFavourites);

module.exports = userrouter;