import { useContext, useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import { UserContext } from "../context/UserContext"

const Post = () => {

  const [blogInfo, setBlogInfo] = useState(null)
  const { userInfo } = useContext(UserContext)
  const { id } = useParams()
  useEffect(() => {
    fetch(`http://localhost:8080/blog/${id}`)
      .then(res => res.json())
        .then(Info => setBlogInfo(Info))
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      {!blogInfo && ''}
      {
        blogInfo &&

        <div className="bg-white py-6 sm:py-8 lg:py-12">
          {/* {
            blogInfo._id === userInfo.id &&
            <button className="absolute right-3 z-10 cursor-pointer rounded-md p-2 bg-pink-200  text-white">🖊️</button>
          } */}
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="grid gap-8  lg:gap-12">
              <div>
                <div className="h-64 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
                  <img src={blogInfo.postImg} className="h-full w-full object-cover object-center" />
                </div>
              </div>

              <div className="md:pt-8">
                <span className="text-center mr-2 font-bold text-indigo-500 md:text-left">{blogInfo.name}</span>
                <span className="text-sm text-gray-400">{blogInfo.updatedAt.split('T')[0].split("-").reverse().join('-')}</span>


                <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6 md:text-left">{blogInfo.title}</h1>

                <div className="mb-6 text-gray-500 sm:text-lg md:mb-8" dangerouslySetInnerHTML={{ __html: blogInfo.description }} />

                <h2 className="mb-2 text-center text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 md:text-left">Summary</h2>

                <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">{blogInfo.summary}</p>
              </div>
            </div>
          </div>
        </div>
      }


    </>
  )
}

export default Post
