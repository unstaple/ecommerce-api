const Order = require('../models/Order');

const checkIdempotency = async (req, res, next) => {
  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const existingOrder = await Order.findOne({ idempotencyKey: key });
  if (existingOrder) {
    return res.status(409).json({ 
      message: 'Duplicate request detected', 
      order: existingOrder 
    });
  }
  next();
};

module.exports = checkIdempotency;