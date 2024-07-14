const { User } = require("../models/User.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SharpFunction = require("../utils/sharp.utils");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary.utils");
const salt = bcrypt.genSaltSync(12);
// Firebase Admin SDK
const admin = require("firebase-admin");
const serviceAccount = require("../blogify-mern-firebase-adminsdk.json"); // replace with your own blogify-mern-firebase-adminsdk.sample.json file
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    try {
        const profileImg = req?.file;
        // console.log(profileImg)
        let profileImgPath = null;
        if (profileImg) {
            profileImgPath = profileImg?.path;
            await SharpFunction(profileImgPath)
            profileImgPath = await uploadOnCloudinary(profileImgPath)
            if (!profileImgPath)
                return res.status(400).json({ error: 'Image upload failed' });

            profileImgPath = profileImgPath.url
        }
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImg: profileImgPath
        });
        if (!user) {
            return res.status(400).json({ error: 'User creation failed' });
        }

        // we can also create token here and directly login the user but we don't want to login the user directly after signup

        return res
            .status(200)
            .json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(400).json(error?.message);
    }
};

const googleLogin = async (req, res) => {
    const { access_token } = req.body;
    if (!access_token) {
        return res.status(400).json({ error: 'Access token is required' });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        // console.log(decodedToken)
        let { email, name, picture, user_id } = decodedToken;
        if (!email || !name || !picture) {
            return res.status(400).json({ error: 'Google login failed' })
        }
        // resolution of the image is 96x96, we need 384x384
        picture = picture.replace("s96-c", "s384-c")
        // check if user exists
        const user = await User.findOne({ email });
        if (user) {
            // user exists =>can be via google login or Email based login
            if (!user.googleId) {
                // user is not google user
                return res.status(400).json({ error: 'Login with email and password' })
            }
            // console.log("user: ", user)
            // user is google user => create token and login
            const token = jwt.sign({
                id: user._id,
                email: user.email,
                name: user.name,
                googleId: user.googleId,
                profileImg: user.profileImg
            }, process.env.JWT_SECRET, { expiresIn: '2d' });
            if (!token) {
                return res.status(400).json({ error: 'Token creation failed' });
            }
            return res
                .status(200)
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                })
                .json({ message: 'Google login successful' });
        }
        // user does not exists => create new user and store into db
        const newUser = await User.create({
            name,
            email,
            profileImg: picture,
            googleId: user_id,
        });

        if (!newUser) {
            return res.status(400).json({ error: 'Google login failed' })
        }
        // console.log(newUser)
        // create token
        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            googleId: newUser.googleId,
            profileImg: newUser?.profileImg
        }, process.env.JWT_SECRET, { expiresIn: '2d' });
        if (!token) {
            return res.status(400).json({ error: 'Token creation failed' });
        }
        return res
            .status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            })
            .json({ message: 'Google login successful' });
    } catch (error) {
        // console.log("Error in googleLogin: ", error?.message);
        return res.status(400).json(error?.message);
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    try {
        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // decrypt password
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Create token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImg: user?.profileImg
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' });
        if (!token) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        return res
            .status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            })     // httpOnly:true => cookie can't be modified by client side script
            .json({ message: 'Login successful' });
    } catch (error) {
        return res.status(400).json(error?.message);
    }

};

const Logout = async (req, res) => {
    // remove token from cookie
    return res
        .status(200)
        .cookie('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        })
        .json({ message: 'Logout successful' });
}

const profile = async (req, res) => {
    const user = req.user;
    return res
        .status(200)
        .json({
            message: 'Profile fetched successfully',
            user
        });
}

const editProfile = async (req, res) => {
    const myUser = req.user;
    const { name, email, password, newPassword } = req.body;
    // console.log(name,email,password,newPassword)
    if (!name || !email) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    try {
        // console.log(req.files)
        const profileImg = req?.files ? req.files['profileImg'][0] : undefined;
        // console.log(profileImg)
        let profileImgPath = null;
        if (profileImg) {
            profileImgPath = profileImg?.path;
            await SharpFunction(profileImgPath)
            profileImgPath = await uploadOnCloudinary(profileImgPath)
            if (!profileImgPath)
                return res.status(400).json({ error: 'Image upload failed' });

            profileImgPath = profileImgPath.url
        }

        let hashedPassword = null;
        if (password && newPassword) {
            const user = await User.findOne({ email });
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            hashedPassword = bcrypt.hashSync(newPassword, salt);
        }

        // finding the user by id
        const userById = await User.findById(myUser.id);
        if (!userById) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // checking for email already exists
        if (userById.email !== email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already exists' })
            }
        }
        let previousProfileImg = null;
        let user = null;

        if (hashedPassword === null) {
            // only name and email is updated
            userById.name = name;
            userById.email = email;
        }
        else {
            // password is also updated
            userById.name = name;
            userById.email = email;
            userById.password = hashedPassword;
        }

        if (profileImgPath) {
            previousProfileImg = userById.profileImg;
            userById.profileImg = profileImgPath;
        }

        user = await userById.save();
        if (!user) {
            return res.status(400).json({ error: 'Update failed' })
        }

        // delete previous profile image from cloudinary
        if (previousProfileImg) {
            await deleteFromCloudinary(previousProfileImg)
        }
        user.password = undefined;

        // have to sign again new token 
        const newToken = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            profileImg: user?.profileImg
        }, process.env.JWT_SECRET, { expiresIn: '2d' });
        return res
            .status(200)
            .cookie('token', newToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            })
            .json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        // console.log(error)
        return res.status(400).json(error?.message);
    }
}


module.exports = {
    signup,
    googleLogin,
    Login,
    Logout,
    profile,
    editProfile
}