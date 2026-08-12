const mongoose = require('mongoose')


const VehicleSchema = new Schema({
    loader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle_type: {
        type: String,
        enum: ['mini_truck', 'tempo', 'pickup', 'e_cart'],
        required: true
    },
    registration_number: {
        type: String,
        required: true,
        unique: true
    },
    capacity_kg: {
        type: Number,
        required: true
    },
    vehicle_photo_url: {
        type: String
    },
    document_status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    is_available: {
        type: Boolean,
        default: false
    },
    current_location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        } // [lng, lat]
    },
}, { timestamps: true });


module.exports = {
    VehicleSchema
}