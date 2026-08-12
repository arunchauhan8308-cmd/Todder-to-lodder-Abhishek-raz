const express = require('express');
const router = express.Router();
const { registerVehicle, getMyVehicles, toggleAvailability, findNearbyLoaders } = require('../controllers/vehicle.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

router.get('/nearby', authenticateUser, findNearbyLoaders);
router.get('/my-vehicles', authenticateUser, getMyVehicles);
router.post('/register', authenticateUser, registerVehicle);
router.patch('/:id/toggle-status', authenticateUser, toggleAvailability);

module.exports = router;