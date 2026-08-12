const { ShopOwnerModel, LoaderModel, AdminModel } = require("../models/user.model");
const { generateToken } = require("../utils/auth.util");
const { generateHashPassword, comparePassword } = require("../utils/password.util");

exports.signupUser = async (req, res) => {
    try {
        const userDetails = req.body;

        // Check request body
        if (!userDetails || Object.keys(userDetails).length === 0) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // hash the password
        const hashedPassword = await generateHashPassword(userDetails.password)
        userDetails.password = hashedPassword

        const { role } = userDetails;

        if (!role) {
            return res.status(400).json({ success: false, message: 'Role is required' });
        }

        let saveUser;

        switch (role) {
            case 'shop_owner':
                saveUser = await ShopOwnerModel.create(userDetails);
                break;
            case 'loader':
                saveUser = await LoaderModel.create(userDetails);
                break;
            case 'admin':
                saveUser = await AdminModel.create(userDetails);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid role provided' });
        }
        const token = generateToken(saveUser)

        return res.status(201).json({
            success: true,
            token,
            message: `${role.replace('_', ' ')} account created successfully`,
            data: saveUser
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email or Phone number already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



exports.loginUser = async (req, res) => {
    try {
        const { phone, password, role } = req.body;

        if (!phone || !password || !role) {
            return res.status(400).json({ 
                success: false, 
                message: "Phone, password, and role are required" 
            });
        }

        let user;

        switch (role) {
            case 'shop_owner':
                user = await ShopOwnerModel.findOne({ phone });
                break;
            case 'loader':
                user = await LoaderModel.findOne({ phone });
                break;
            case 'admin':
                user = await AdminModel.findOne({ phone });
                break;
            default:
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid role provided" 
                });
        }

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found with this phone number" 
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials (Wrong Password)" 
            });
        }

        // 5. Agar password match ho gaya, toh Token banayein
        const token = generateToken(user); 

        // 6. Response bhejein
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            data: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role
            } 
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};