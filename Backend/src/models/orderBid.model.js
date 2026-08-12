const mongoose = require('mongoose');

const OrderBidSchema = new mongoose.Schema({
    order_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    loader_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    shop_owner_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Optional: If you want loaders to negotiate the price, you can save their offer here
    proposed_fare: { 
        type: Number, 
        default: null 
    },
    // Optional: Let the shop owner know how fast they can reach the pickup
    eta_minutes: { 
        type: Number, 
        default: null 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled_by_loader'],
        default: 'pending'
    }
}, { timestamps: true });

// This index ensures that one loader cannot spam or send multiple requests for the same order
OrderBidSchema.index({ order_id: 1, loader_id: 1 }, { unique: true });

module.exports = mongoose.model('OrderBid', OrderBidSchema);