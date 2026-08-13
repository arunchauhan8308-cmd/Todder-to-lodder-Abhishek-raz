const express = require('express');
const orderRoute = express.Router();
const loaderController = require('./../controllers/loader.controller')

const { getFareEstimate, createOrder, acceptOrder } = require('../controllers/order.controller');
const { authenticateUser } = require('../utils/auth.util');

orderRoute.post('/estimate', authenticateUser, getFareEstimate);
orderRoute.post('/create', authenticateUser, createOrder);
orderRoute.patch('/:orderId/accept', authenticateUser, acceptOrder);
orderRoute.get('/nearby', authenticateUser, loaderController.getNearbyOrders);

module.exports = orderRoute;