const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const router = express.Router();

const User = require("../models/User");
const fetchUser = require("../middleware/fetchuser");

// ROUTE-1: Register a user using: POST "/api/auth/register". Doesn't Require Login
router.post('/register', [
    body('username', 'Username must be atleast 5 characters').isLength({ min:5 }),
    body('name', 'Name must be atleast 3 characters').isLength({ min:3 }),
    body('email', 'Enter a valid email').not().isEmpty().isEmail().normalizeEmail(),
    body('password', 'Enter a valid password').isLength({ min:8 }).matches(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      ),
    body('address', 'Address cannot be empty').exists(),
    body('phone', 'Enter a valid phone number').isNumeric().isLength({ min:10 })
], async (req, res)=> {
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        success = false;
        return res.json({ success, errors: errors.array(), status: 400 })
    }
    try {
        let user = await User.findOne({email: req.body.email});
        if(user) {
            success = false;
            return res.json({success, error: "This email is associated to another account", status: 400})
        }
        let user1 = await User.findOne({username: req.body.username});
        if(user1) { 
            success = false;
            return res.json({success, error: "This username is associated to another account", status: 400})
        }
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
            address: req.body.address,
            phone: req.body.phone
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, secret);
        success = true;
        res.json({success, authToken, status: 200});
    }

    catch(err) {
        res.send({error: "Internal Server Error", status: 500});
    }

});

// ROUTE-2: Login a user using: POST "/api/auth/login". Doesn't Require Login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res)=> {
    let success = false;
    const errors = validationResult(req.body);
    if(!errors.isEmpty()) {
        success = false;
        return res.json({success, error: errors.array()[0].msg, status: 400 })
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            success = false;
            return res.json({success, error: "User with this email doesn't exist", status: 400});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            success = false;
            return res.json({success, error: "Wrong email and password combination", status: 400});
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, secret);
        success = true;
        res.json({success, authToken, status: 200});

    } 
    catch(err) {
        res.send({error: "Internal Server Error", status: 500});
    }
})

// ROUTE-3: Get logged-in user details using: POST "/api/auth/profile". Require Login
router.post('/profile', fetchUser, async (req, res)=> {
    let success = false;
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        success = true;
        res.send({success, user, status: 200});
    }
    catch(error) {
        success = false;
        res.send({success, error: "Internal Server Error", status: 500});
    }
})

module.exports = router;