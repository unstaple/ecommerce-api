const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const checkIdempotency = require('../middleware/idempotency');
const Product = require('../models/Product');
const apicache = require('apicache');

const cache = apicache.middleware;

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// --- Product Routes ---

router.get('/products', cache('5 minutes'), async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    const product = new Product({ name, price, description, stock });
    await product.save();
    
    apicache.clear(); 
    
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/products/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    
    apicache.clear(); 
    
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// To Refill Stock
router.put('/products/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { stock } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { stock: stock }, 
      { new: true }
    );

    apicache.clear(); 

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// --- Order Routes ---
router.post('/orders', authenticate, authorize(['user', 'admin']), checkIdempotency, orderController.createOrder);

router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await require('../models/User').find().select('-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/orders', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const orders = await require('../models/Order').find()
      .populate('user', 'username')
      .populate('products', 'name price');
    const groupedOrders = orders.map(order => {
      const orderJson = order.toObject();
      const productMap = {};
      orderJson.products.forEach(p => {
        const id = p._id.toString();
        if (productMap[id]) {
          productMap[id].quantity += 1;
        } else {
          productMap[id] = {
            _id: p._id,
            name: p.name,
            price: p.price,
            quantity: 1 
          };
        }
      });

      orderJson.products = Object.values(productMap);
      
      return orderJson;
    });
    res.json(groupedOrders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;