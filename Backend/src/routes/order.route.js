const express = require('express');
const router = express.Router();
const { getFareEstimate, createOrder, acceptOrder } = require('../controllers/order.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

router.post('/estimate', authenticateUser, getFareEstimate);
router.post('/create', authenticateUser, createOrder);
router.patch('/:orderId/accept', authenticateUser, acceptOrder);

module.exports = router;