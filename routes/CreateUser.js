const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "ThisisCafeEaseWebsitebySidNangiPelu$#";

router.post(
  "/createuser",
  [
    body(
      "email",
      "Invalid email. Please check the email address format."
    ).isEmail(),
    body("name", "Name must be alphabetic").isAlpha(),
    // body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters longgg.'),
    // body('password').isLength({ min: 5 }).withMessage('Weak password. Please use a stronger password.'),
    body("password", "Invalid Password , must be minimum of 5 characters ").isLength({ min: 5 }),
  ],
  async (req, res) => {
    console.log("re", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ success: false , errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt)

    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        // username:req.body.username
        // location:req.body.location
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email", "Incorrect email address.").isEmail(),
    body("password", "Incorrect password.").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ errors: "Invalid User" });
      }

      const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
      if (!pwdCompare) {
        return res.status(400).json({ errors: "Invalid Password" });
      }

      const data ={
          user:{
              id:userData.id
          }
      }
      // return res.json({ success: true });
              const authToken = jwt.sign(data,jwtSecret)
              return res.json({success:true,authToken:authToken})
    } catch (error) {
      console.log(error);
      res.json({ success: false, errorCode: "Server Error" });
    }
  }
);

module.exports = router;
