import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const CreatePost = () => {
  return (
    <>
      <div className="flex flex-col w-2/3 mx-auto my-5 lg:w-2/4">
        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font mx-auto">Login</h2>
        {/* <p className="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p> */}
        <div className="relative mb-4">
          <label htmlFor="Tittle" className="leading-7 text-sm text-gray-600">Tittle</label>
          <input
            type="text"
            name="tittle"
            placeholder='Tittle'
            className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <div className="relative mb-4">
          <label htmlFor="Summary" className="leading-7 text-sm text-gray-600">Summary</label>
          <input
            type="text"
            name="summary"
            placeholder='Summary'
            className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <div className="relative mb-4">
          <label htmlFor="file" className="leading-7 text-sm text-gray-600">Image</label>
          <input
            type="file"
            name="postImg"
            className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <ReactQuill/>

        <button
          className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg mt-3"
          onClick={() => { }}
        >Login</button>

      </div>
    </>
  )
}

export default CreatePost
