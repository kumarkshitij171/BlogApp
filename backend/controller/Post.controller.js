const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary.utils');
const { Post } = require('../models/Post.model');
const mongoose = require('mongoose');
const { Comment } = require('../models/Comment.model');



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

        if (!postImg) {
            return res.status(400).json({ error: 'Image upload failed' })
        }

        // send the post into DB => but how we know which user is creating the post

        // from the token we have to parse the values 
        const user = req.user

        const post = await Post.create({
            title,
            summary,
            postImg,
            description,
            username: user.id
        })
        if (!post) {
            return res.status(400).json({ error: 'Post creation failed' })
        }

        return res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        return res.status(400).json({ error: error?.message });
    }
}

const getAllPost = async (req, res) => {
    // get all the posts from the database
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "username",
                foreignField: "_id",
                as: "username"
            }
        },
        {
            $project: {
                'username.password': 0, // exclude 'password' field
                'username.email': 0, // exclude 'email' field
            }
        },
        {
            $sort: { updatedAt: -1 }
        },
        {
            $limit: 20
        }
    ]);

    // if(!posts?.length){
    //     return res.status(400).json({ error: 'No posts found' })
    // }

    return res
        .status(200)
        .json(posts)
}

const getBlog = async (req, res) => {
    const { id } = req.params
    try {
        let _id = new mongoose.Types.ObjectId(id)
        const blog = await Post.aggregate([
            {
                $match: {
                    _id
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "username",
                    foreignField: "_id",
                    as: "username",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    let: { post_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$post_id", "$$post_id"] },
                                        { $eq: ["$isReply", false] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "user_id",
                            },
                        },
                        {
                            $unwind: "$user_id"
                        },
                        {
                            $lookup: {
                                from: "comments",
                                localField: "replies",
                                foreignField: "_id",
                                as: "replies",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "user_id",
                                            foreignField: "_id",
                                            as: "user_id",
                                        },
                                    },
                                    {
                                        $project: {
                                            "user_id.email": 0,
                                            "user_id.password": 0,
                                            replies: 0,
                                        },
                                    },
                                    {
                                        $addFields: {
                                            user_id: {
                                                $first: "$user_id",
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    as: "comments",
                },
            },
            {
                $addFields: {
                    TotalComment: {
                        $size: "$comments",
                    },
                },
            },
            {
                $project: {
                    "username.password": 0,
                    "username.email": 0,
                    "comments.replies.post_id": 0,
                    "comments.post_id": 0,
                    "comments.replies.parentComment": 0,
                    "comments.user_id.password": 0,
                    "comments.user_id.email": 0
                },
            },
        ])

        if (!blog?.length) {
            return res.status(400).json({ error: 'Post not found' })
        }

        return res.status(200).json(blog[0])
    } catch (error) {
        return res.status(400).json({ error: error?.message })
    }
}

const editPost = async (req, res) => {
    // getting the Id
    const { id } = req.params;
    // checking the post author is same as the user that is logged in if yes then we update the post using middleware
    const user = req.user;
    try {
        const post = await Post.findById(id)
        if (!post) {
            return res.status(400).json({ error: 'Post not found' })
        }
        // console.log((post.username._id).toString()===decodedToken.id);
        if ((post.username._id).toString() !== user.id) {
            return res.status(400).json({ error: 'You are not authorized to edit this post' })
        }
        // user verified now can update the post
        let postImgPath
        let oldImgPath = post.postImg
        if (req?.file) {
            postImgPath = req.file.path
            postImgPath = await uploadOnCloudinary(postImgPath)
            if (!postImgPath) {
                return res.status(400).json({ error: 'Image upload failed' })
            }
        }
        const { title, summary, description } = req.body

        // update the post into db
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            summary,
            description,
            postImg: postImgPath ? postImgPath.url : oldImgPath,
        }, { new: true })
        if (!updatedPost) {
            return res.status(400).json({ error: 'Post update failed' })
        }
        // delete the old image from cloudinary
        if (postImgPath)
            await deleteFromCloudinary(oldImgPath)

        return res
            .status(200)
            .json({ message: 'Post updated successfully' })
    } catch (error) {
        return res.status(400).json({ error: error?.message })
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params
    const user = req.user
    // check if the user is authorized to delete the post
    try {
        const post = await Post.findById(id)
        if (!post) {
            return res.status(400).json({ error: 'Post not found' })
        }
        if ((post.username._id).toString() !== user.id) {
            return res.status(400).json({ error: 'You are not authorized to delete this post' })
        }
        // delete the post
        const PostFound = await Post.findById(id)
        // Deleting the comments and replies of the post
        PostFound.comments?.map(
            async (comment) => {
                comment.replies?.map(
                    async (reply) => {
                        await Comment.findByIdAndDelete(reply._id)
                    })
                await Comment.findByIdAndDelete(comment._id)
            }
        )
        // All comments and replies deleted now delete the post
        const deletedPost = await Post.findByIdAndDelete(id)
        if (!deletedPost) {
            return res.status(400).json({ error: 'Post delete failed' })
        }
        // delete the image from cloudinary
        await deleteFromCloudinary(post.postImg)
        return res
            .status(200)
            .json({ message: 'Post deleted successfully' })
    } catch (error) {
        return res.status(400).json({ error: error?.message })
    }
}

module.exports = { CreatePost, getAllPost, getBlog, editPost, deletePost };