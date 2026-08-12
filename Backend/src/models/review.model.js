const mongoose = require('mongoose')

const ReviewSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    reviewer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
}, { timestamps: true });


module.exports = {
    ReviewSchema
}