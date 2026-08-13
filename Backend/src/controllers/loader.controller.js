const OrderModel = require('./../models/order.model')
const vehicleModel = require('./../models/vehicle.model')

exports.getNearbyOrders = async (req, res) => {
    try {
        const loaderId = req.user.id;
        const role = req.user.role;

        // 1. Role Isolation: Only loaders can view nearby jobs
        if (role !== 'loader') {
            return res.status(403).json({ success: false, message: "Only loaders can access this route" });
        }

        // 2. Find the Loader's Vehicle to get their location and vehicle type
        const loaderVehicle = await vehicleModel.findOne({ loader_id: loaderId });

        if (!loaderVehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found. Please register a vehicle first." });
        }

        // if (loaderVehicle.document_status !== 'verified') {
        //     return res.status(403).json({ success: false, message: "Your vehicle documents are not verified yet." });
        // }

        // Extract loader's current coordinates
        const loaderCoordinates = loaderVehicle.current_location.coordinates;

        // 3. Find Nearby Orders
        // We query the Order collection using the 2dsphere index on 'pickup.location'
        const MAX_DISTANCE_METERS = 10000; // 10 km radius

        const availableOrders = await OrderModel.find({
            status: 'requested', // Only show orders that haven't been accepted yet[cite: 1]
            vehicle_type_requested: loaderVehicle.vehicle_type, // Match the loader's vehicle type[cite: 1]
            'pickup.location': {
                $near: {
                    $geometry: { 
                        type: 'Point', 
                        coordinates: loaderCoordinates // [lng, lat] of the loader
                    },
                    $maxDistance: MAX_DISTANCE_METERS
                }
            }
        }).sort({ createdAt: -1 }); // Show newest orders first

        return res.status(200).json({
            success: true,
            count: availableOrders.length,
            data: availableOrders
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};