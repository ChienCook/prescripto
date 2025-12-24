import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

import userModel from '../models/userModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);

        // save user into Database
        const user = await newUser.save();
        // create user token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            res.json({ success: false, message: 'Email exists, please enter other email' });
        } else {
            res.json({ success: false, message: error.message });
        }
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user profile  data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            res.json({ success: false, message: 'User does not exist' });
        } else {
            res.json({ success: true, user });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        const { email, phone, address, gender, dob, name, userId } = req.body;
        const imageFile = req.file;

        if (!email || !phone || !name || !dob || !gender) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        let imageUrl = '';
        if (imageFile) {
            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });

            imageUrl = imageUpload.secure_url;

            if (user.image) {
                const isCloudinaryImage = user.image.includes('cloudinary') && !user.image.startsWith('data:image');
                if (isCloudinaryImage) {
                    const oldImageUrl = user.image; // "https://res.cloudinary.com/dyhyw0y7l/image/upload/v1766156504/i6i3qosoh4zt7gkgjhqw.png";

                    const imagename = oldImageUrl.split('/').pop(); // "i6i3qosoh4zt7gkgjhqw.png"

                    const publicId = imagename.split('.')[0]; // "i6i3qosoh4zt7gkgjhqw"

                    // remove old user image on cloudinary
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }
        await userModel.findByIdAndUpdate(userId, {
            email,
            name,
            phone,
            dob,
            gender,
            image: imageUrl || user.image,
            address: address
                ? JSON.parse(address)
                : {
                      line1: '',
                      line2: '',
                  },
        });

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, getProfile, updateProfile };
