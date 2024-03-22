import React, { useRef } from 'react';

const EditBtn = ({ className, changeImg }) => {
  const fileInput = useRef(null);

  const handleClick = () => {
    // Trigger the file input click event
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    // Get the selected file
    const file = event.target.files[0];

    // Call the changeImg function with the selected file
    changeImg(file);
  };

  return (
    <>
      <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: 'none' }} />
      <button onClick={handleClick} className={`absolute z-20 ` + className}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      </button>
        {
            fileInput.current?.files[0] ? (<p className='mt-5 bg-red-300'>New Image</p>) : ""
        }
    </>
  );
};

export default EditBtn;