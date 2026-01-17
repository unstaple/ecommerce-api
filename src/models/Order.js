const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
  totalAmount: { type: Number, required: true },
  idempotencyKey: { type: String, unique: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);