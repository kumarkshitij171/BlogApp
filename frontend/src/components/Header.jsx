import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Header() {

    const { userInfo, setUserInfo,loggedIn,setLoggedIn } = useContext(UserContext)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile`,
            {
                credentials: 'include',
                method: 'POST',
            },
        ).then(response => response.json())
            .then(data => (
                setUserInfo(data.user)
            ))
        .catch(err => console.log(err));

        // console.log(userInfo);
    }, [loggedIn]);

    async function HandleLogout() {
        await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/logout`, {
            credentials: 'include',
            method: 'POST',
        })
        
        setUserInfo(null)
        setLoggedIn(false)
    }

    return (
        <div className="flex m-2">

            <div className="left font-bold text-2xl">
                <Link to="/" className="logo ">
                    MyBlogApp
                </Link>
            </div>

            <div className="right ml-auto">

                {userInfo &&
                    <div className="flex">
                        <Link to="/create-post" className="font-semibold mx-3 hover:text-pink-600">create a post</Link>

                        <details className="dropdown cursor-pointer mr-2">
                            <summary className="mx-1 btn">{userInfo?.name}</summary>
                            <ul className="py-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box absolute p-3 mr-2">
                                <li className="hover:text-pink-600" onClick={HandleLogout}><Link to='/'>Logout</Link></li>
                            </ul>
                        </details>

                    </div>}
                {!userInfo &&
                    <div>
                        <NavLink
                            to="/login"
                            className={({ isActive }) => {
                                return isActive ? "text-pink-400 font-semibold mx-3 hover:text-pink-600" : "font-semibold mx-3 hover:text-pink-600"
                            }}>
                            Login
                        </NavLink>

                        <NavLink
                            to="/signup"
                            className={({ isActive }) => {
                                return isActive ? "text-pink-400 font-semibold mx-3 hover:text-pink-600" : "font-semibold mx-3 hover:text-pink-600"
                            }}>
                            Signup
                        </NavLink>
                    </div>}


            </div>

        </div>
    );
}