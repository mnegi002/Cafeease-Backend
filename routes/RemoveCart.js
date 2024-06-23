const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

router.post("/removecartitems", async (req, res) => {
  try {
    const { email, name } = req.body;

    const existingCart = await CartItem.findOne({ email });

    if (!existingCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const existingItem = existingCart.items.find(item => item.name === name);
    // console.log("itemmmmm" , existingItem)
    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Item not found in the cart' });
    }

    if (existingItem.quantity > 1) {
      // If the item quantity is greater than 1, decrement the quantity
      existingItem.quantity -= 1;
      existingItem.totalPrice -= existingItem.price;
     // Subtract the price of one item
    } else {
      // If the quantity is 1, remove the entire item
      existingCart.items = existingCart.items.filter(item => item.name !== name);
    }

    // Update the totalAmount in the existing cart
    existingCart.totalAmount = existingCart.items.reduce((total, item) => total + item.totalPrice, 0);

    await existingCart.save();

    res.json({ success: true });
  } catch (err) {
    // console.log(err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;
