const mongoose = require('mongoose')

const PaymentSchema = new Schema({
 order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
 amount: { type: Number, required: true },
 method: { type: String, enum: ['cash','upi','card','wallet'], required: true },
 status: { type: String, enum: ['pending','success','failed','refunded'],
default: 'pending' },
 transaction_ref: String,
 paid_at: Date,
}, { timestamps: true });


module.exports = {
    PaymentSchema
}