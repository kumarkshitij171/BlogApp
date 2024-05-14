import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Dropdown from "./Dropdown";
import SearchPost from "./SearchPost";

export default function Header() {
    const { userInfo, setUserInfo, loggedIn } = useContext(UserContext)

    const fetchData = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile`, {
            credentials: 'include',
        });
        // console.log("Res: ", res)
        if (res.status == 200) {
            const data = await res.json();
            // console.log("data: ", data)
            setUserInfo(data.user);
        } else {
            console.log("Error fetching user data")
        }
    }

    useEffect(() => {
        fetchData();
        // console.log(userInfo);
    }, [loggedIn]);

    return (
        <div className="flex m-2">
            <div className="left font-bold text-xl md:text-2xl">
                <Link to="/" className="logo ">
                    Blogify
                </Link>
            </div>
            <div className="right ml-auto">
                <div className="flex">
                    {/* search post */}
                    <SearchPost />
                    {userInfo &&
                        <div className="flex">
                            <Link
                                to="/create-post"
                                className="font-semibold mx-1 sm:mx-2 hover:text-pink-600 pt-1">
                                Create post
                            </Link>
                            <Dropdown />
                        </div>
                    }
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
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}