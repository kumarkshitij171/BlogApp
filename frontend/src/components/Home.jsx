import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";

const Home = () => {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/posts')
      .then(res => res.json())
      .then(posts => setPosts(posts))
  }, [])

  return (
    <>
      <div className="bg-white py-3">
        <div className="mx-3 max-w-screen-xl px-4 md:px-8">
          {/* <div className="mb-2">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Blog</h2>

            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.</p>

          </div> */}
          {/* <!-- Blog article - start --> */}
          <div className="grid gap-8 mb-4 mt-2">
            {posts.length > 0 && posts.map(posts =>
            (
              <div key={posts._id} className="flex flex-col items-center gap-4 md:flex-row lg:gap-6" >

                <div className="group relative block h-56 w-full shrink-0 self-start overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-32 md:w-60 lg:h-56 lg:w-96">
                  <img src={posts.postImg} loading="lazy" alt="Photo by @..." className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                </div>

                <div className="flex flex-col gap-2">
                  <div className='flex gap-1'>
                    <span className="text-sm text-black opacity-85 bold">{posts.username[0].name}</span>
                    <span className="text-sm text-gray-400">{posts.updatedAt.split('T')[0].split("-").reverse().join('-')}</span>
                    {/*  to format date
                      let dateStr = "15-02-2024";
                      let dateParts = dateStr.split("-");
                      let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

                      let formattedDate = dateObject.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                      console.log(formattedDate); // Outputs: "15 Feb 2024" 
                  */}
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

            ))}
            {/* <!-- Blog article - end --> */}

            {posts.length <= 0 && <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">No post to show create one.</h2>}

          </div>
        </div>
      </div >
    </>
  )
}

export default Home
