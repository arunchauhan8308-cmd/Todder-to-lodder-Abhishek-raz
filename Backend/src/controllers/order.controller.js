const { calculateFare } = require('../utils/fareCalculator');
const { calculateDistance } = require('../utils/distanceCalculator');
const OrderModel = require('../models/order.model');
const VehicleModel = require('.././models/vehicle.model')
const PaymentModel = require('../models/payment.model'); // Aapka Payment schema model




exports.createOrder = async (req, res) => {
    try {
        const shopOwnerId = req.user.id || req.user._id;
        const { 
            pickup, 
            drop, 
            goods, 
            vehicle_type_requested, 
            estimated_fare, 
            payment_method, 
            payment_details 
        } = req.body;

        // 1. Order database mein create karein
        const newOrder = await OrderModel.create({
            shop_owner_id: shopOwnerId,
            pickup,
            drop,
            goods,
            vehicle_type_requested,
            estimated_fare,
            status: 'requested'
        });

        // 2. Payment details ke mutabiq Payment record save karein
        if (payment_method === 'upi' && payment_details) {
            await PaymentModel.create({
                order_id: newOrder._id,
                amount: estimated_fare,
                method: 'upi',
                status: 'success',
                transaction_ref: payment_details.razorpay_payment_id,
                paid_at: new Date()
            });
        } else {
            await PaymentModel.create({
                order_id: newOrder._id,
                amount: estimated_fare,
                method: 'cash',
                status: 'pending'
            });
        }

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.acceptOrder = async (req, res) => {
    try {
        const loaderId = req.user.id;
        const role = req.user.role;
        const orderId = req.params.orderId;
        const { vehicle_id } = req.body; 

        if (role !== 'loader') {
            return res.status(403).json({ success: false, message: "Only loaders can accept orders" });
        }

        if (!vehicle_id) {
            return res.status(400).json({ success: false, message: "Please provide the vehicle_id you are using" });
        }

        // 1. Verify that the vehicle belongs to this loader
        const loaderVehicle = await VehicleModel.findOne({ _id: vehicle_id, loader_id: loaderId });
        if (!loaderVehicle) {
            return res.status(403).json({ success: false, message: "Yeh vehicle aapka nahi hai ya register nahi hai." });
        }

        // 2. Check if order exists and is still requested, then update
        const order = await OrderModel.findOneAndUpdate(
            { _id: orderId, status: 'requested' }, 
            {
                $set: { 
                    status: 'accepted', 
                    loader_id: loaderId, 
                    vehicle_id: vehicle_id 
                },
                $push: { 
                    status_history: { status: 'accepted', timestamp: new Date() } 
                }
            },
            { new: true } 
        );

        if (!order) {
            return res.status(409).json({ 
                success: false, 
                message: "Order has already been accepted by another loader or cancelled." 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Aapne order successfully accept kar liya hai!",
            data: order
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFareEstimate = async (req, res) => {
    try {
        const { pickup_location, drop_location, vehicle_type, goods_category } = req.body;

        if (!pickup_location || !drop_location || !vehicle_type) {
            return res.status(400).json({ success: false, message: "Missing required fields for estimate" });
        }

        // TODO: Yahan Google Maps Distance Matrix API call hogi
        // Example logic: const distanceData = await getGoogleMapsDistance(pickup_location, drop_location);
        // const distance_km = distanceData.distanceValueInKm;

        // Abhi testing ke liye hum maan lete hain ki distance 12.5 km hai
        const distance_km = 12.5; 

        // Utility function call karke fare nikalna
        const estimated_fare = calculateFare(distance_km, vehicle_type, goods_category);

        return res.status(200).json({
            success: true,
            data: {
                distance_km: distance_km,
                vehicle_type: vehicle_type,
                estimated_fare: estimated_fare
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



exports.getFareEstimate = async (req, res) => {
    try {
        // Frontend se coordinates aur details aayengi
        const { pickup_location, drop_location, vehicle_type, goods_category } = req.body;

        if (!pickup_location || !drop_location || !vehicle_type) {
            return res.status(400).json({ success: false, message: "Missing required fields for estimate" });
        }

        // 1. Asli distance nikalne ke liye Google Maps API call karein
        // pickup_location.coordinates = [lng, lat]
        const distance_km = await calculateDistance(
            pickup_location.coordinates, 
            drop_location.coordinates
        );

        // 2. Apne fare formula se price nikalein
        const estimated_fare = calculateFare(distance_km, vehicle_type, goods_category);

        return res.status(200).json({
            success: true,
            data: {
                distance_km: distance_km,
                vehicle_type: vehicle_type,
                estimated_fare: estimated_fare
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAcceptedOrders = async (req, res) => {
    try {
        const loaderId = req.user.id;
        const role = req.user.role;

        if (role !== 'loader') {
            return res.status(403).json({ success: false, message: "Only loaders can access this route" });
        }

        // Aap chahein toh status mein 'accepted', 'arrived', 'loaded', 'in_transit' sabhi ko include kar sakte hain
        const acceptedOrders = await OrderModel.find({
            loader_id: loaderId,
            status: { $in: ['accepted', 'arrived', 'loaded', 'in_transit'] }
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: acceptedOrders.length,
            data: acceptedOrders
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


exports.getShopOwnerOrders = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;

        // Fetch all orders created by this specific shop owner
        const orders = await OrderModel.find({ shop_owner_id: shopOwnerId })
            .populate('loader_id', 'name phone')
            .populate('vehicle_id', 'vehicle_type vehicle_number')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Order status update (e.g., Completed)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // 'accepted', 'in_transit', 'completed', etc.
        const loaderId = req.user.id;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // Optional check: Ensure yahi loader assigned hai
        if (order.loader_id && order.loader_id.toString() !== loaderId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this order." });
        }

        order.status = status;
        order.status_history.push({ status, timestamp: new Date() });
        if (status === 'completed') {
            order.final_fare = order.estimated_fare;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




exports.getLoaderEarningsAndHistory = async (req, res) => {
    try {
        const loaderId = req.user.id;

        const loader = await UserModel.findById(loaderId);
        const completedOrders = await OrderModel.find({ 
            loader_id: loaderId, 
            status: 'completed' 
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            total_earnings: loader ? loader.total_earnings || 0 : 0,
            data: completedOrders
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};