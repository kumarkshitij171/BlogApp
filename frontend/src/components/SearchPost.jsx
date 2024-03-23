import React, { useContext, useState } from 'react'
import { PostContext } from '../context/PostContext'

const SearchPost = () => {

    const { setPosts } = useContext(PostContext)
    const [seachText, setSearchText] = useState("")
    let debounceTimeout

    const handleSearch = (e) => {
        setSearchText(e.target.value)
        // filter the post on the basis of search text value by title
        // clear the previous search result
        clearTimeout(debounceTimeout)

        debounceTimeout = setTimeout(() => {
            setPosts(prevPosts => prevPosts
                .filter(post => post && post
                    .title
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                ))

        }, 1200);
        if (e.target.value === "") {
            fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts`)
                .then(res => res.json())
                .then(posts => setPosts(posts))
        }
    }

    return (
        <div className='flex items-center bg-[#eee] md:p-1 rounded-md shadow-sm cursor-pointer h-9 md:h-10 w-44 md:w-72 pl-1'>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-6 md:h-6 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            <input
                className="bg-transparent rounded-md md:p-1 mx-1 outline-none"
                placeholder="search"
                type="search"
                value={seachText}
                onChange={(e) => handleSearch(e)}
            />
        </div>
    )
}

export default SearchPost
