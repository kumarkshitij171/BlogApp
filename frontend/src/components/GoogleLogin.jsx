import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from "./auth/Firebase.auth"
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const GoogleLogin = ({ type, setRes, setError }) => {

    const navigate = useNavigate()
    const { userInfo, setUserInfo, setLoggedIn } = useContext(UserContext)

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [userInfo])

    const googleSignIn = async (access_token) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ access_token })
            })
            if (res.status == 200) {
                const data = await res.json()
                console.log(data)
                setLoggedIn(true)
                setUserInfo(data?.user)
                navigate('/')
            }
            else {
                setRes(true)
                setError("Google login failed")
                setTimeout(() => {
                    setRes(false)
                }, 2000);
            }
        } catch (error) {
            setRes(true)
            setError(error)
            setTimeout(() => {
                setRes(false)
            }, 2000);
        }
    }

    const handleClick = () => {
        signInWithPopup(auth, provider)
            .then((data) => googleSignIn(data.user.accessToken))
            .catch((error) => console.log(error))
    }
    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
                <svg className="mr-2 -ml-1 w-4 h-4 text-center" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
                    </path>
                </svg>
                Sign {type} with Google
                <div></div>
            </button>
        </div>
    )
}

export default GoogleLogin
