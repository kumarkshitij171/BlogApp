import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <div className="bg-white py-3">
        <div className="mx-3 max-w-screen-xl px-4 md:px-8">
          {/* <div className="mb-2">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Blog</h2>

            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.</p>

          </div> */}

          <div className="grid gap-8 mb-4 mt-2">
            {/* <!-- Blog article - start --> */}
            <div className="flex flex-col items-center gap-4 md:flex-row lg:gap-6">

              <div className="group relative block h-56 w-full shrink-0 self-start overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-32 md:w-60 lg:h-56 lg:w-96">
                <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by @..." className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">July 19, 2021</span>
                <h2 className="text-xl font-bold text-gray-800">
                  <p className="transition duration-100 ">New trends in Tech</p>
                </h2>
                <p className="text-gray-500">This is a section of some simple filler text, also known as placeholder text.</p>
                <div>
                  <Link to="/blog/:blogId" className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</Link>
                </div>
              </div>
          
            </div>
            {/* <!-- Blog article - end --> */}

          </div>

        </div>
      </div>
    </>
  )
}

export default Home
