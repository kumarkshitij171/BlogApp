const { Comment } = require('../models/Comment.model.js');
const { Post } = require('../models/Post.model.js');
const mongoose = require('mongoose');

const createComment = async (req, res) => {
    const user = req.user;
    const { comment } = req.body;
    // query parameter
    const post_id = req.query.post_id;
    try {
        if (!comment || !post_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const savedComment = await Comment.create({
            comment,
            post_id,
            user_id: user.id
        })

        if (!savedComment) {
            return res.status(400).json({ error: 'Comment creation failed' });
        }

        // pushing that comment into the post
        const post = await Post.findByIdAndUpdate(post_id, {
            $push: {
                comments: savedComment.id
            }
        })

        if (!post) {
            return res.status(400).json({ error: 'Comment creation failed' });
        }

        return res.status(200).json({ message: 'Comment created successfully' });
    } catch (error) {
        console.log("Error in createComment", error?.message)
        return res.status(400).json({ error: error?.message })
    }
}

const replyComment = async (req, res) => {
    const user = req.user;
    const { reply } = req.body;
    const { post_id, parentComment } = req.query;

    try {
        if (!reply || !post_id || !parentComment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const savedComment = await Comment.create({
            comment: reply,
            post_id,
            user_id: user.id,
            isReply: true,
            parentComment
        })

        if (!savedComment) {
            return res.status(400).json({ error: 'Reply creation failed' });
        }

        // pushing that comment into the reply of the parent comment
        const parent = await Comment.findByIdAndUpdate({ _id: parentComment }, {
            $push: {
                replies: savedComment.id
            }
        })

        if (!parent) {
            return res.status(400).json({ error: 'Reply creation failed' });
        }

        return res.status(200).json({ message: 'Reply created successfully' });
    } catch (error) {
        // console.log("Error in replyComment", error?.message)
        return res.status(400).json({ error: error?.message })
    }

}

const deleteComment = async (req, res) => {
    const user = req.user;
    const comment_id = req.query.comment_id;
    try {
        if (!comment_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const _id = new mongoose.Types.ObjectId(comment_id)
        // aggregation pipeline to check if the user is authorized to delete the comment
        // lookup the user collection to get the user details
        const myComment = await Comment.aggregate([
            {
                $match: {
                    _id
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_id'
                }
            },
            {
                $project: {
                    "user_id.password": 0
                },
            },
        ])

        if (!myComment) {
            return res.status(400).json({ error: 'Comment not found' });
        }

        // console.log("myComment", myComment[0].user_id[0]._id.toString())
        // console.log("user", user.id)

        // user is authorized to delete the comment
        if (myComment[0].user_id[0]._id.toString() != user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // deleting the replies of the comment associated with the comment
        const replies = myComment[0].replies;
        if (replies.length > 0) {
            replies.forEach(async (reply) => {
                await Comment.findByIdAndDelete(reply._id);
            })
        }

        // After deleting the replies, delete the comment
        const deletedComment = await Comment.findByIdAndDelete(comment_id);
        if (!deletedComment) {
            return res.status(400).json({ error: 'Comment deletion failed' });
        }

        return res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        return res.status(400).json({ error: error?.message })
    }
}

const deleteReply = async (req, res) => {
    const user = req.user;
    const reply_id = req.query.reply_id;
    if (!reply_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const _id = new mongoose.Types.ObjectId(reply_id)
        // aggregation pipeline to check if the user is authorized to delete the reply
        const myReply = await Comment.aggregate([
            {
                $match: {
                    _id
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_id'
                }
            },
            {
                $project: {
                    "user_id.password": 0
                },
            },
        ])

        if (!myReply) {
            return res.status(400).json({ error: 'Reply not found' });
        }
        // if it is not reply
        if (!myReply[0].isReply) {
            return res.status(400).json({ error: 'Invalid Reply id' });
        }

        if (myReply[0].user_id[0]._id.toString() != user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const deletedReply = await Comment.findByIdAndDelete(reply_id);
        if (!deletedReply) {
            return res.status(400).json({ error: 'Reply deletion failed' });
        }

        return res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        return res.status(400).json({ error: error?.message })
    }
}

module.exports = {
    createComment,
    replyComment,
    deleteComment,
    deleteReply
}