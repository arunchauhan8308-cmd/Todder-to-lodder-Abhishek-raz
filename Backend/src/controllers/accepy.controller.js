const OrderModel = require('./../models/order.model')
const VehicleModel = require('./../models/vehicle.model');

exports.acceptOrder = async (req, res) => {
    try {
        const loaderId = req.user.id;
        const orderId = req.params.id; // The order ID from the URL (e.g., /api/v1/orders/:id/accept)

        // 1. Check if the user is a loader
        if (req.user.role !== 'loader') {
            return res.status(403).json({ success: false, message: "Only loaders can accept orders" });
        }

        // 2. Get the Loader's Vehicle ID (assuming a loader has one active vehicle)
        const loaderVehicle = await VehicleModel.findOne({ loader_id: loaderId });
        if (!loaderVehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found. Please register a vehicle." });
        }

        // 3. ATOMIC ACCEPT OPERATION (PREVENTS DOUBLE-ACCEPT)
        // This query ONLY finds the order if the status is still 'requested'
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { _id: orderId, status: 'requested' },
            {
                $set: { 
                    status: 'accepted', 
                    loader_id: loaderId, 
                    vehicle_id: loaderVehicle._id 
                },
                $push: { 
                    status_history: { status: 'accepted', timestamp: new Date() } 
                }
            },
            { new: true } // Returns the updated document
        );

        // 4. If order is null, it means someone else already accepted it or it doesn't exist
        if (!updatedOrder) {
            return res.status(400).json({ 
                success: false, 
                message: 'Yeh order kisi aur loader ne accept kar liya hai ya available nahi hai (Order already accepted)' 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order accepted successfully",
            data: updatedOrder
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};