import React from 'react';
import ReactQuill from 'react-quill';

const Editor = ({value,onChange}) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean'],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        ],
    }

    return (
        <>
            <ReactQuill modules={modules} value={value} onChange={onChange} />
        </>
    )
}

export default Editor;