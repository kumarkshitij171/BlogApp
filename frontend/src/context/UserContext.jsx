import { createContext, useState } from "react";

export const UserContext = createContext({})

export function UserContextprovider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [loggedIn, setLoggedIn]= useState(false);

    return (
        <UserContext.Provider value={{userInfo,setUserInfo,loggedIn,setLoggedIn}}>
            {children}
        </UserContext.Provider>
    )
}