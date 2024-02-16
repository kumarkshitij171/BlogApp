const fs = require('fs');
const { uploadOnCloudinary } = require('../utils/cloudinary.utils');
const { Post } = require('../models/Post.model');
const jwt = require('jsonwebtoken')

const CreatePost = async (req, res) => {
    try {
        const { title, summary, description } = req.body;
        if (!title || !summary || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        let postImg = req.file;
        if (!postImg) {
            return res.status(400).json({ error: 'Image is required' });
        }
        // console.log(title,summary,description,postImg);

        // either upload the image to cloud or save to the server(uploads folder) and save the url to the database

        // we store into cloudinary so after uploading we delete image from server
        const postImgPath = postImg.path

        postImg = await uploadOnCloudinary(postImgPath)
        postImg = postImg.url

        // send the post into DB => but how we know which user is creating the post

        // from the token we have to parse the values 
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log(decodedToken);

        const post = await Post.create({
            title,
            summary,
            postImg,
            description,
            username: decodedToken.id
        })
        if (!post) {
            return res.status(400).json({ error: 'Post creation failed' })
        }

        // Once the image is successfully uploaded, delete the local file
        // fs.unlink(postImgPath, (err) => {
        //     if (err) {
        //         console.error('Error deleting file:', err);
        //     } else {
        //         console.log('File deleted successfully');
        //     }
        // });

        return res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        return res.status(400).json({ error: error?.message });
    }
}

const getAllPost = async (req, res) => {
    // get all the posts from the database
    const posts = await Post
        .find()
        .populate('username')
        .sort({ updatedAt: -1 })
        .limit(20);

    return res.json(posts)
}

const getBlog = async(req,res)=>{
    const {id} = req.params    
    const blog = await Post.findById(id).populate('username')
    return res.json(blog)
}

module.exports = { CreatePost, getAllPost, getBlog };