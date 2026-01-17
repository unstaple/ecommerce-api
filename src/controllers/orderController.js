const Order = require('../models/Order');
const Product = require('../models/Product');
const apicache = require('apicache');

exports.createOrder = async (req, res) => {
  // We keep a list of products we modified so we can undo changes if needed
  const productsModified = []; 

  try {
    const { products, totalAmount } = req.body;
    
    // 1. Get Idempotency Key from headers (Fixes the Duplicate Key Error)
    const idempotencyKey = req.headers['idempotency-key'];

    // 2. Get User ID
    const userId = req.user ? (req.user.userId || req.user.id) : null;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    // 3. Count Quantities
    const productCounts = {};
    products.forEach(id => {
      productCounts[id] = (productCounts[id] || 0) + 1;
    });

    // 4. Check Stock & Prepare Deductions
    for (const [id, qty] of Object.entries(productCounts)) {
      const product = await Product.findById(id);
      
      if (!product) return res.status(404).json({ error: `Product not found: ${id}` });
      if (product.stock < qty) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });

      // Deduct stock
      product.stock -= qty;
      await product.save(); // Save immediately to lock it in
      
      // Add to our list so we can "undo" this later if the order fails
      productsModified.push({ product, qty }); 
    }

    // 5. Create & Save Order
    const order = new Order({
      user: userId,
      products: products,
      totalAmount: totalAmount,
      idempotencyKey: idempotencyKey // 🔥 FIX: Save the key!
    });

    await order.save(); // If this fails, we jump to catch()

    // 6. Success! Clear Cache
    apicache.clear();
    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    console.error("❌ Order Failed:", err);

    // 🔥 ROLLBACK MECHANISM
    // If we get here, something broke (like the duplicate key error).
    // We must put the stock BACK.
    if (productsModified.length > 0) {
        console.log("🔄 Rolling back stock...");
        for (const item of productsModified) {
            item.product.stock += item.qty; // Add the quantity back
            await item.product.save();
        }
    }

    // Send the error to the user
    // (Check if it's the duplicate key error specifically)
    if (err.code === 11000) {
        return res.status(400).json({ error: "Duplicate Order detected (Idempotency Key)." });
    }

    res.status(500).json({ error: 'Order creation failed: ' + err.message });
  }
};