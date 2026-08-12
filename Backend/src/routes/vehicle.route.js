const express = require('express');
const vehicleRouter = express.Router();
const { registerVehicle, getMyVehicles, toggleAvailability, findNearbyLoaders } = require('../controllers/vehicle.controller');
const authenticate = require('./../utils/auth.util')

vehicleRouter.get('/nearby', authenticate.authenticateUser, findNearbyLoaders);
vehicleRouter.get('/my-vehicles', authenticate.authenticateUser, getMyVehicles);
vehicleRouter.post('/register', authenticate.authenticateUser, registerVehicle);
vehicleRouter.patch('/:id/toggle-status', authenticate.authenticateUser, toggleAvailability);

module.exports = vehicleRouter;