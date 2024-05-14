import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Alert from './Alert';
import { UserContext } from '../context/UserContext';
import { loginValidation } from '../validations/Login.validation';
import GoogleLogin from './GoogleLogin';


const Login = () => {

  const navigate = useNavigate()
  const { userInfo, setUserInfo, setLoggedIn } = useContext(UserContext)

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [userInfo])

  const handleClick = () => {
    navigate("/signup");
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [res, setRes] = useState(false)

  const handlesubmit = async (e) => {
    e.preventDefault()

    const isvalid = await loginValidation.isValid({ email, password })

    if (isvalid) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/login`, {
        method: 'post',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // to send cookies
      });
      // console.log(response);

      if (response.status === 200) {
        response.json()
          .then(data => (
            // console.log(data),
            setLoggedIn(true),
            setUserInfo(data?.user)
          ))
          .catch(err => console.log(err))
        navigate('/')
      }
      else {
        setRes(true)
        await response.json().then(data => setError(data.error))
        setTimeout(() => {
          setRes(false)
        }, 2000);
      }
    }
    else {
      setRes(true)
      setError('Invalid Email or Password')
      setTimeout(() => {
        setRes(false)
      }, 2000);
    }
  }
  return (
    <>
      <main>
        <div className="flex flex-col w-2/3 mx-auto my-5 lg:w-2/4">
          {res && <Alert type='Warning' message={error} />}
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font mx-auto">Login</h2>
          {/* <p className="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p> */}
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email <span className='text-red-500'>*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='example@email.com'
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password <span className='text-red-500'>*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Password'
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            className="text-white bg-indigo-500 border-0 mb-2 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={handlesubmit}
          >Login</button>
          <GoogleLogin type={"In"} setRes={setRes} setError={setError} />
          <p className="text-s text-gray-500 mt-3">
            Don't have an account? <span onClick={handleClick} className="text-indigo-500 hover:text-indigo-600 cursor-pointer">SignUp</span>
          </p>
          {/* <p className='mt-4'><span className='text-red-500'>*</span> fields are mandatory to fill</p> */}
        </div>
      </main>
    </>
  )
}

export default Login
