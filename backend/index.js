const express = require('express');
const cors = require('cors');
const { signup, Login, profile, Logout } = require('./controller/User.controller.js');
const app = express();
require('dotenv').config({ path: './env' });
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser())

const router = express.Router();

// Database connection
(async () => {
    await mongoose.connect(process.env.MONGO_URI, {}).then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log('Database connection failed', err);
    });
})() 

// Routes
app.use('/', router);

router.route('/signup').post(signup);
router.route('/login').post(Login);
router.route('/logout').post(Logout);
router.route('/profile').post(profile);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
