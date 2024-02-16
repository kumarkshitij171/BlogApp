const express = require('express');
const cors = require('cors');
const { signup, Login, profile, Logout } = require('./controller/User.controller.js');
const app = express();
const path = require('path');
require('dotenv').config({ path: './env' });
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { CreatePost, getAllPost, getBlog } = require('./controller/Post.controller.js');
const multer = require('multer');

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
        let fileNewName = path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname);
        cb(null, fileNewName) // Use the original file name with date
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

const router = express.Router();

// Database connection
(async () => {
    await mongoose.connect(process.env.MONGO_URI, {}).then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log('Database connection failed', err);
    });
})()

//* Routes
app.use('/', router);

// User Routes
router.route('/signup').post(signup);
router.route('/login').post(Login);
router.route('/logout').post(Logout);
router.route('/profile').post(profile);

// Post Routes
router.route('/create-post').post(
    upload.single('postImg'),
    CreatePost);

router.route('/posts').get(getAllPost)
router.route('/blog/:id').get(getBlog)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
