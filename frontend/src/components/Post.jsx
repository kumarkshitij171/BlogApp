import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from "../context/UserContext"
import Comment from "./Comment"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
const Post = () => {
  document.title = "Blogify"

  const [blogInfo, setBlogInfo] = useState(null)
  const { userInfo } = useContext(UserContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const [commentCheck, setCommentCheck] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/blog/${id}`)
      .then(res => res.json())
      .then(Info => setBlogInfo(Info))
      .catch(err => console.log(err))
  }, [commentCheck, userInfo])

  const editPost = async () => {
    navigate(`/edit-post/${id}`)
  }

  const [open, setOpen] = useState(false);
  const [modalVal, setModalVal] = useState('');
  const [PostDel, setPostDel] = useState('delete');

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const modalOpen = () => {
    onOpenModal()
  }

  const deletePost = async () => {
    setPostDel('Deleting...')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/delete-post/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (response.status === 200) {
      navigate('/')
    }
  }

  return (
    <>
      {!blogInfo && ''}
      {
        blogInfo &&

        <div className="bg-white py-6 sm:py-8 lg:py-12">
          {
            blogInfo.username[0]._id === userInfo?.id &&

            <div className="absolute right-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-8 cursor-pointer mr-2 inline-block bg-white rounded-md " onClick={editPost}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-8 cursor-pointer inline-block bg-white rounded-md" onClick={modalOpen}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              <Modal
                open={open}
                onClose={onCloseModal}
                classNames={{
                  overlay: 'customOverlay',
                  modal: 'customModal',
                }}
                center>
                <div className="m-3 py-1">
                  <p className="">Are you want to <span className="font-bold text-red-600">{'delete'}</span> the post.</p>
                  <p className="my-1">Write delete in input field</p>
                  <input className="bg-gray-200 p-1 rounded-md" type="text" value={modalVal} onChange={(e) => setModalVal(e.target.value)} />
                  <button className="bg-red-600 block p-2 my-2 rounded-lg font-bold text-white" disabled={modalVal !== 'delete'} onClick={deletePost}>{PostDel}</button>
                </div>
              </Modal>

            </div>
          }

          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="grid gap-8 lg:gap-12">
              <div>
                <div className="h-64 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
                  <img src={blogInfo.postImg} className="h-full w-full object-fill object-center" />
                </div>
              </div>

              <div className="md:pt-8">
                <span className="text-center mr-2 font-bold text-indigo-500 md:text-left">{blogInfo.username[0].name}</span>
                <span className="text-sm text-gray-400">{blogInfo.createdAt.split('T')[0].split("-").reverse().join('-')}</span>


                <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6 md:text-left">{blogInfo.title}</h1>

                <div className="mb-6 text-gray-500 sm:text-lg md:mb-8" id="postDesc" dangerouslySetInnerHTML={{ __html: blogInfo.description }} />

                <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 md:text-left">Summary</h2>

                <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">{blogInfo.summary}</p>
              </div>
            </div>
            <Comment
              comments={blogInfo.comments}
              TotalComment={blogInfo.TotalComment}
              postedUserId={blogInfo.username[0]._id}
              postId={blogInfo._id}
              commentCheck={commentCheck}
              setCommentCheck={setCommentCheck}
            />
          </div>
        </div>
      }

    </>
  )
}

export default Post
