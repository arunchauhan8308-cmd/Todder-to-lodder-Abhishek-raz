const mongoose = require('mongoose')

const OrderSchema = new Schema({
    shop_owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    loader_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    vehicle_id: { type: Schema.Types.ObjectId, ref: 'Vehicle', default: null },
    pickup: {
        address: String,
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: [Number]
        }
    },
    drop: {
        address: String,
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: [Number]
        }
    },
    goods: { category: String, weight_kg: Number, photo_url: String },
    vehicle_type_requested: { type: String, required: true },
    scheduled_at: { type: Date, default: null },
    status: {
        type: String,
        enum:
            ['requested', 'accepted', 'arrived', 'loaded', 'in_transit', 'delivered', 'cancelled'],
        default: 'requested'
    },
    status_history: [{
        status: String, timestamp: {
            type: Date, default:
                Date.now
        }
    }],
    estimated_fare: Number,
    final_fare: Number,
    cancelled_by: {
        type: String, enum: ['shop_owner', 'loader', null], default: null
    },
    cancellation_reason: String,
    delivery_otp: String,
    delivery_photo_url: String,
}, { timestamps: true });
OrderSchema.index({ 'pickup.location': '2dsphere' });
OrderSchema.index({ 'drop.location': '2dsphere' });


module.exports = {
    OrderSchema
}