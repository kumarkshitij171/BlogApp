const express = require('express');
const cors = require('cors');
const { signup, Login, profile, Logout, editProfile, googleLogin } = require('./controller/User.controller.js');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { CreatePost, getAllPost, getBlog, editPost, deletePost } = require('./controller/Post.controller.js');
const multer = require('multer');
const { createComment, replyComment, deleteComment, deleteReply } = require('./controller/Comment.controller.js');
const AuthenticateUser = require('./middleware/Authentication.js');
const { getRazorPayApiKey, createPayment, storeVerifiedPayment } = require('./controller/Payment.controller.js');

const PORT = process.env.PORT || 8080;
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Multer middleware
// const upload = multer({ dest: 'uploads/' });

// Set up Multer storage => gives us more control over the file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/') // Define the destination folder
    },
    filename: function (req, file, cb) {
        // Generate a new filename using the original name, timestamp, and extension
        let fileNewName = path.parse(file.originalname.replace(/\s/g, '_')).name + '-' + Date.now() + path.extname(file.originalname);
        cb(null, fileNewName) // Use the original file name with date
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

const router = express.Router();

// Database connection
(async () => {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log('Database connection failed', err);
        process.exit(1);
    });
})()

// Rate Limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: "Too many requests, please try again later.",
});

// Routes
app.use('/', router);

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to Blog App API' });
});

// User Routes
router.route('/signup').post(
    limiter,
    upload.single('profileImg'),
    signup);
router.route('/login').post(limiter, Login);
router.route('/logout').post(AuthenticateUser, Logout);
router.route('/profile').get(AuthenticateUser, profile);
router.route('/edit-profile').put(
    limiter,
    AuthenticateUser,
    upload.fields([{ name: 'profileImg', maxCount: 1 }]),
    editProfile);

// Google Auth
router.route('/google-login').post(googleLogin);

// Post Routes
router.route('/create-post').post(
    limiter,
    AuthenticateUser,
    upload.single('postImg'),
    CreatePost
);

router.route('/posts').get(getAllPost)
router.route('/blog/:id').get(getBlog)

// Edit Post => may update the file so adding multer middleware
// PUT is restricted to create or update operations, and it should not be used for read operations.
router.route('/edit-post/:id').put(
    AuthenticateUser,
    upload.single('postImg'),
    editPost)

// delete post
router.route('/delete-post/:id').delete(AuthenticateUser, deletePost)

// Comment Routes
router.route('/create-comment').post(AuthenticateUser, createComment);
router.route('/reply-comment').post(AuthenticateUser, replyComment);
router.route('/delete-comment').delete(AuthenticateUser, deleteComment);
router.route('/delete-reply').delete(AuthenticateUser, deleteReply);

// Razorpay Payment Gateway
router.route('/get-razorpay-api-key').get(getRazorPayApiKey);
router.route('/create-payment').post(createPayment)
router.route('/verify-payment').post(storeVerifiedPayment);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
