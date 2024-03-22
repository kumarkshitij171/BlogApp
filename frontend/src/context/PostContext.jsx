import { createContext, useState } from "react";

export const PostContext = createContext({})

export function PostContextprovider({ children }) {
    const [posts, setPosts] = useState([]);

    return (
        <PostContext.Provider value={{posts,setPosts}}>
            {children}
        </PostContext.Provider>
    )
}