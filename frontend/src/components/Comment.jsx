import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import Alert from './Alert'

const comment = ({ comments, TotalComment, postedUserId, postId, commentCheck, setCommentCheck }) => {

    const { userInfo } = useContext(UserContext)
    const [comment, setComment] = useState('')
    const [commentId, setCommentId] = useState(null);
    const [reply, setReply] = useState(false)
    const [replyComment, setReplyComment] = useState('')
    const [errorMsg, setErrorMsg] = useState(null)


    const handleReplyButton = (comment) => {
        setCommentId(comment);
        setReply(!reply)
    }

    const handleComment = async () => {
        if (comment.length > 0)
            fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/create-comment?post_id=${postId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    credentials: 'include',
                    body: JSON.stringify({ comment }),
                }
            ).then(res => res.json())
                .then(data => setCommentCheck(data), setComment(''))
                .catch(err => setErrorMsg(err?.message),
                    setTimeout(() => {
                        setErrorMsg(null)
                    }, 2000))
    }

    const handleReplyComment = (commentId) => {
        if (replyComment.length > 0)
            fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/reply-comment?post_id=${postId}&parentComment=${commentId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    credentials: 'include',
                    body: JSON.stringify({ reply: replyComment }),
                }
            ).then(res => res.json())
                .then(data => { setCommentCheck(data), setReplyComment('') })
                .catch(err => console.log(err))

        setReply(false)
    }

    const deleteComment = async (myCommentId) => {
        // console.log("delete comment")
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/delete-comment?comment_id=${myCommentId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        const data = await res.json()
        setCommentCheck(data)
    }
    const deleteReply = async (myReplyId) => {
        // console.log("delete reply")
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/delete-reply?reply_id=${myReplyId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        const data = await res.json()
        setCommentCheck(data)
    }


    return (
        <div className='flex flex-col items-center'>
            {errorMsg && <Alert type={'warninig'} message={errorMsg} />}
            <h3 className='w-full text-left my-2 font-semibold text-xl'>Comments ({TotalComment})</h3>
            {/* can comment if it is logged in */}
            {userInfo?.id &&
                <div className="flex mx-14 p-2 w-full">
                    <input
                        className='flex-grow rounded-l-md bg-[#eee] shadow-sm h-10 p-2'
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="comment" />
                    <button
                        className='bg-indigo-500 text-white rounded-r-md py-1 px-5 cursor-pointer hover:bg-indigo-600'
                        onClick={handleComment}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            }

            {/* all comments */}
            <div className='flex flex-col w-full'>
                {/* nested more and more reply comment can be possible and if no profile pic available the use logo.png which is inside public folder */}
                {
                    comments?.map((comment) => (
                        <div key={comment._id} className="">
                            <div className='flex flex-col'>
                                <div className="flex items-center p-2">
                                    <img src={comment.user_id?.profileImg ? comment.user_id.profileImg : '/logo.png'}
                                        alt='profile'
                                        className='h-12 w-12 rounded-full'
                                    />

                                    <div className='flex flex-col ml-2 gap-x-2' >
                                        <p className='font-bold'>{comment.user_id.name}
                                            {
                                                postedUserId === comment.user_id._id &&
                                                <span className='ml-5 font-semibold text-white bg-slate-800 px-1 sm:px-2 py-1 rounded-md text-xs sm:text-base '>Author</span>
                                            }
                                        </p>
                                        <p className='mt-1 text-xs sm:text-base '>{comment.comment}</p>

                                    </div>


                                    {/* reply */}
                                    {
                                        userInfo?.id &&
                                        <div className="ml-auto">
                                            {
                                                userInfo?.id === comment.user_id._id &&
                                                <button
                                                    onClick={() => deleteComment(comment._id)}
                                                    className='mr-2'>
                                                    <svg

                                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            }
                                            <button
                                                onClick={() => handleReplyButton(comment._id)}
                                                className=' bg-gray-500 text-white px-2 sm:px-3 py-2 rounded cursor-pointer font-medium text-xs sm:text-base '
                                            >
                                                {(reply && commentId === comment._id) ? "Cancel" : "Reply"}
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>

                            {/* onClick of button for reply a comment input opens in new line */}
                            {
                                reply && userInfo?.id && commentId == comment._id &&
                                <div className="flex mx-16 p-2 w-[90%] ">
                                    <input
                                        className='rounded-l-md bg-[#eee] shadow-sm h-10 p-2 sm:w-full w-[70%]'
                                        type="text"
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value)}
                                        placeholder="reply" />
                                    <button
                                        className='bg-indigo-500 text-white rounded-r-md py-1 px-5 cursor-pointer hover:bg-indigo-600'
                                        onClick={() => handleReplyComment(comment._id)}
                                    >

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                        </svg>
                                    </button>

                                </div>
                            }
                            {/* reply comments */}
                            {
                                comment.replies.map((reply) => (
                                    <div key={reply._id} className='flex items-center p-2 ml-16'>
                                        <img src={reply.user_id?.profileImg ? reply.user_id.profileImg : '/logo.png'}
                                            alt='profile'
                                            className='h-10 w-10 rounded-full'
                                        />
                                        <div className='flex flex-col ml-2 gap-x-2' >

                                            <p className='font-bold'>{reply.user_id.name}
                                                {
                                                    postedUserId === reply.user_id._id &&
                                                    <span className='ml-5 font-semibold text-white bg-slate-800 px-1 sm:px-2 py-1 rounded-md text-xs sm:text-base '>Author</span>
                                                }
                                            </p>
                                            <div className="flex">
                                                <p className='mt-1 text-xs sm:text-base '>{reply.comment}</p>
                                                {
                                                    userInfo?.id === reply.user_id._id &&
                                                    <button
                                                        onClick={() => deleteReply(reply._id)}
                                                        className='ml-7'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>

                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    ))
                }
            </div>
        </div >
    )
}

export default comment
