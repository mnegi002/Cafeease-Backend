const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/orderData', async (req, res) => {
  try {
    const { email, items, totalAmount, orderDate } = req.body;

    // Find the order with the given email
    let existingOrder = await Order.findOne({ email });

    if (!existingOrder) {
      // If no order exists for the email, create a new order
      await Order.create({
        email,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        orderDate,
      });
    } else {
      // If an order exists for the email, update the existing order
      existingOrder.items.push(...items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })));

      // Recalculate totalAmount based on updated items
      existingOrder.totalAmount = existingOrder.items.reduce((total, item) => total + (item.quantity * item.price), 0);
      
      await existingOrder.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error storing order:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/myorderData', async (req, res) => {
  try {
    let myData = await Order.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (error) {
    res.send("Server Error", error.message);
  }
});

module.exports = router;
