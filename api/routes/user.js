const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



router.post("/signup", async (req, res) => {
  const existingUser = await User.findOne({email: req.body.email });
  if (existingUser) {
    return res.status(422).json({
      message: "User already exists.",
    });
  } 
  
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User created",
        userId: result.id
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/login", async (req, res) => {
	const user = await User.findOne({email: req.body.email });
	if (!user) {
    return res.status(404).json({
      message: "User does not exist!",
    });
  }
	const isEqual = await bcrypt.compare(req.body.password, user.password);

	if (!isEqual) {
		return res.status(401).json({
      message: "Password is incorrect!",
    });		
	}
	if (isEqual) {
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    ); 
		return res.status(200).json({
      message: "Login successfull",
			token: token,
      userId: user.id,
      tokenExpiration: 1
    });	
	}
})

module.exports = router;