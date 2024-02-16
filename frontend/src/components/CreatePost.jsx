import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const modules = {
  toolbar: [
    [{ 'header': [1, 2,3, false] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['bold', 'italic', 'underline','strike', 'blockquote','code-block',],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  ],
}



const CreatePost = () => {

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [postImg, setPostImg] = useState(null);
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  async function handlePost(e){
    e.preventDefault();
    // console.log(title, summary, postImg, description);
    const formData = new FormData();
    formData.append('postImg', postImg);
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('description', description);

    const response = await fetch('http://localhost:8080/create-post', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    // console.log(response);
    if(response.status === 200){
      navigate('/');
    }

  }

  return (
    <>
      <div className="flex flex-col w-2/3 mx-auto my-5 lg:w-2/4">
      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font mx-auto">Create Blog</h2>

        {/* <p className="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p> */}
        <div className="relative mb-4">
          <label htmlFor="Title" className="leading-7 text-sm text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            placeholder='Title'
            className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="relative mb-4">
          <label htmlFor="Summary" className="leading-7 text-sm text-gray-600">Summary</label>
          <input
            type="text"
            name="summary"
            placeholder='Summary'
            className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="relative mb-4">
          <label htmlFor="file" className="leading-7 text-sm text-gray-600">Image</label>
          <input
            type="file"
            name="postImg"
            className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            onChange={(e) => setPostImg(e.target.files[0])}
          />
        </div>

        <ReactQuill modules={modules} value={description} onChange={value=>setDescription(value)}/>

        <button
          className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg mt-3"
          onClick={handlePost}
        >Post</button>

      </div>
    </>
  )
}

export default CreatePost
