const express = require('express')
const mongoDB = require("./db/db")
// const cartDB = require("./db/cartdb")
// const orderDB = require("./db/orderdb")
// const removeDB = require('./db/removedb')
require('dotenv').config({ path: './config/.env' });
const {config} = require('dotenv')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2;
const cors = require("cors")
const fileUpload = require('express-fileupload')
const stripe = require("stripe")(process.env.SECRET_KEY)
const app = express()

mongoDB();
// cartDB();
// orderDB();
// removeDB();

config({path:"./config/.env"})


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_SECRET_KEY, 
  api_secret: process.env.CLOUDINARY_API_KEY 
});

app.use(cors())

// app.use(cors({
//   origin:[process.env.FRONTEND_URL , process.env.DASHBOARD_URL],
//   methods:["GET" , "POST" , "PUT" , "DELETE"],
//   credentials:true,
// }))


app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:"/tmp/",
}))

app.use("/api", require('./routes/Message'));
app.use('/api', require("./routes/CreateUser"));
app.use('/api', require("./routes/OrderData"))
app.use('/api',require("./routes/CartItemData"))
app.use('/api',require("./routes/PaymentData"))
app.use('/api' , require("./routes/RemoveCart"))


app.post("/payment", async (req, res) => {
  try {
    const { product } = req.body;

    // console.log('Received request body:', req.body);

    if (!product || !product.items || !Array.isArray(product.items)) {
      console.log('Invalid product structure');
      return res.status(400).json({ error: 'Invalid product structure' });
    }

    // Iterate through the items and log their titles
    product.items.forEach((item, index) => {
      console.log(`Item ${index + 1}: ${item.title}`);
    });

    // Your code to create lineItems and create a session with Stripe...

    const lineItems = product.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.amount,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.REACT_URL}/success`,
      cancel_url: `${process.env.REACT_URL}/cancel`,
      // payment_intent_data: {
      //   description: `Total Amount: ₹${product.totalAmount}`, }
    });
// 
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error handling payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Handle success endpoint


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})

