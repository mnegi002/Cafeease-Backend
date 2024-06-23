
    const express = require('express');
    const router = express.Router();
    const CartItem = require('../models/CartItem');
    
    router.post("/cartitems", async (req, res) => {
      try {
        const { email, items } = req.body;
    
        const existingCart = await CartItem.findOne({ email });
        // console.log(existingCart)
        if (!existingCart) {
          // If the cart does not exist, create a new one
          await CartItem.create({
            email: req.body.email,
            items: req.body.items,
            totalAmount: items.reduce((total, item) => total + item.totalPrice, 0),
          });
        } else {
          // If the cart already exists, update the existing cart
          // console.log('here')
          items.forEach((newItem) => {
            const existingItem = existingCart.items.find(item =>(
              // console.log('item' , item),
              item.name === newItem.name));
    
            if (existingItem) {
              // If the item with the same name already exists, update its quantity and price
              existingItem.quantity += newItem.quantity;
              existingItem.totalPrice += newItem.totalPrice;
            } else {
              // If the item is not in the cart, add it
              existingCart.items.push(newItem);
            }
          });
    
          // Update the totalAmount in the existing cart
          // console.log('existing cart' , existingCart)
          existingCart.totalAmount = existingCart.items.reduce((total, item) => total + item.totalPrice, 0);
          
          await existingCart.save();
        }
    
        res.json({ success: true });
      } catch (err) {
        // console.log(err.message);
        res.status(500).send('Server Error: ' + err.message);
      }
    });
    router.post("/clearcart" , async (req,res)=>{
      try {
        const { email } = req.body;
    
        // Find and delete cart items for the specified user
        await CartItem.deleteMany({ email });
    
        res.json({ success: true });
      } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ error: 'Server Error' });
      }
    
    })
    module.exports = router;
    
