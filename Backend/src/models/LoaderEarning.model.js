const mongoose = require('mongoose')


const LoaderEarningSchema = new Schema({
    loader_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    gross_fare: Number,
    commission_amount: Number,
    net_payout: Number,
    payout_status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    payout_date: Date,
}, { timestamps: true });