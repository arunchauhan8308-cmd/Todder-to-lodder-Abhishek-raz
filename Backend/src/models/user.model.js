const mongoose = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['shop_owner', 'loader', 'admin'],
        required: true
    },
    profile_photo_url: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    rating_avg: {
        type: Number,
        default: 0
    },
}, { timestamps: true });


module.exports = {
    UserSchema
}