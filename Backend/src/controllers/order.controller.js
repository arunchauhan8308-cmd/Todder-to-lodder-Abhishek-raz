const OrderModel = require('../models/OrderModel');
const { calculateFare } = require('../utils/fareCalculator');
const { calculateDistance } = require('../utils/distanceCalculator');
const { calculateFare } = require('../utils/fareCalculator');


exports.createOrder = async (req, res) => {
    try {
        const shopOwnerId = req.user.id;
        const role = req.user.role;

        if (role !== 'shop_owner') {
            return res.status(403).json({ success: false, message: "Only shop owners can create orders" });
        }

        const { pickup, drop, vehicle_type_requested, goods } = req.body;

        // Validation
        if (!pickup || !drop || !vehicle_type_requested) {
            return res.status(400).json({ success: false, message: "Pickup, Drop aur Vehicle type zaroori hai" });
        }

        const newOrder = await OrderModel.create({
            shop_owner_id: shopOwnerId,
            pickup: pickup,      
            drop: drop,          
            goods: goods,        
            vehicle_type_requested: vehicle_type_requested,
            status_history: [{ status: 'requested', timestamp: new Date() }]
        });

        return res.status(201).json({
            success: true,
            message: "Order requested successfully",
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




// Nayi API: Order place karne se pehle Estimate nikalne ke liye
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