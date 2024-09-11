import React, { useContext, useState, useCallback, useRef } from 'react'
import { PostContext } from '../context/PostContext'

const SearchPost = () => {
    const { setPosts } = useContext(PostContext)
    const [searchText, setSearchText] = useState("")
    const debounceTimeoutRef = useRef(null)

    const fetchAllPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts`)
            if (!response.ok) {
                throw new Error('Failed to fetch posts')
            }
            const posts = await response.json()
            setPosts(posts)
        } catch (error) {
            console.error('Error fetching posts:', error)
            // You might want to set an error state here or show a notification to the user
        }
    }

    const filterPosts = (posts, searchValue) => {
        return posts.filter(post => {
            const title = post?.title?.toLowerCase() || '';
            const description = post?.description?.toLowerCase() || '';
            const username = post?.username?.[0]?.name?.toLowerCase() || '';
            const summary = post?.summary?.toLowerCase() || '';

            return title.includes(searchValue.toLowerCase()) ||
                description.includes(searchValue.toLowerCase()) ||
                username.includes(searchValue.toLowerCase()) ||
                summary.includes(searchValue.toLowerCase());
        });
    }

    const handleSearch = useCallback(async (e) => {
        const searchValue = e.target.value;
        setSearchText(searchValue);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
            if (searchValue === "") {
                await fetchAllPosts();
            } else {
                setPosts(prevPosts => filterPosts(prevPosts, searchValue));
            }
        }, 300);
    }, [setPosts]);

    return (
        <div className='flex items-center bg-[#eee] md:p-1 rounded-md shadow-sm cursor-pointer h-9 md:h-10 w-24 sm:w-44 md:w-72 pl-1'>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-6 md:h-6 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            <input
                className="bg-transparent rounded-md md:p-1 mx-1 w-inherit outline-none"
                placeholder="search"
                type="search"
                value={searchText}
                onChange={handleSearch}
            />
        </div>
    )
}

export default SearchPost