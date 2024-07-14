import { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom'
import { PostContext } from '../context/PostContext';
import ReactLoading from "react-loading";
import Footer from "./Footer";

const Home = () => {

  const { posts, setPosts } = useContext(PostContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Blogify"
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts`)
      .then(res => res.json())
      .then(posts => setPosts(posts),
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="bg-white py-3 min-h-[74vh]">
        <div className="mx-3 max-w-screen-xl px-4 md:px-8">
          {/* <!-- Blog article - start --> */}
          <div className="grid gap-8 mb-4 mt-2">
            {
              posts.length > 0 && posts.map(posts => (
                <div key={posts._id} className="flex flex-col items-center gap-4 md:flex-row lg:gap-6" >

                  <div className="group relative block h-56 w-full shrink-0 self-start overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-32 md:w-60 lg:h-56 lg:w-96">
                    <img src={posts.postImg} loading="lazy" alt="Photo by @..." className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className='flex gap-1'>
                      <span className="text-sm text-black opacity-85 bold">{posts.username[0].name}</span>
                      <span className="text-sm text-gray-400">{posts.createdAt.split('T')[0].split("-").reverse().join('-')}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      <p className="transition duration-100 ">{posts.title}</p>
                    </h2>
                    <p className="text-gray-500">{posts.summary}</p>
                    <div>
                      <Link to={`/blog/${posts._id}`} className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</Link>
                    </div>
                  </div>

                </div>
              ))
            }
            {/* <!-- Blog article - end --> */}

            {
              posts.length <= 0 &&
              <div className="">
                <h2
                  className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                  No post to show create one.
                </h2>
              </div>
            }
            {
              loading && <div className="">
                <div className="flex flex-col items-center">
                  <ReactLoading type="bars" color="#0000FF"
                    height={50} width={50} />
                  <p className="font-semibold">Fetching Data from the backend</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div >
      <Footer />
    </>
  )
}

export default Home
