const express = require('express');
const cors = require('cors');
const { signup, Login, profile, Logout, editProfile, googleLogin } = require('./controller/User.controller.js');
const app = express();
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { CreatePost, getAllPost, getBlog, editPost, deletePost } = require('./controller/Post.controller.js');
const multer = require('multer');
const { createComment, replyComment, deleteComment, deleteReply } = require('./controller/Comment.controller.js');
const AuthenticateUser = require('./middleware/Authentication.js');

const PORT = process.env.PORT || 8080;
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser())

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

// Routes
app.use('/', router);

// User Routes
router.route('/signup').post(
    upload.single('profileImg'),
    signup);
router.route('/login').post(Login);
router.route('/logout').post(AuthenticateUser, Logout);
router.route('/profile').get(AuthenticateUser, profile);
router.route('/edit-profile').put(
    AuthenticateUser,
    upload.fields([{ name: 'profileImg', maxCount: 1 }]),
    editProfile);

// Google Auth
router.route('/google-login').post(googleLogin);

// Post Routes
router.route('/create-post').post(
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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
