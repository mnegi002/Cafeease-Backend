const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

router.post('/payments', async (req, res) => {
    const { email, sessionId } = req.body;

    try {
        // Create a new Payment document
        const newPayment = new Payment({ email, sessionId });

        // Save the document to MongoDB
        const savedPayment = await newPayment.save();

        res.status(201).json(savedPayment);
    } catch (error) {
        console.error('Error saving payment document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
