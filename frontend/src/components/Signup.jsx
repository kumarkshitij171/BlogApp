import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import { signupValidation } from '../validations/signup.validation';
import { UserContext } from '../context/UserContext';
import GoogleLogin from './GoogleLogin';

const Signup = () => {

  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext)

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [userInfo])

  const handleClick = () => {
    navigate("/login");
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profileImg, setProfileImg] = useState(null)

  const [res, setRes] = useState(false)
  const [message, setMessage] = useState('')
  const [mtype, setMtype] = useState('')

  const handlesubmit = async (e) => {
    e.preventDefault()
    // console.log(name, email, password)

    const isvalid = await signupValidation.isValid({ name, email, password })
    if (isvalid) {
      const formData = new FormData();
      formData.append('profileImg', profileImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signup`, {
        method: 'post',
        body: formData,
        // headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.status === 200) {
        setRes(true)
        setMessage('Registration Successful')
        setMtype('Success')
        setTimeout(() => {
          setRes(false)
        }, 3000);
        navigate('/login')
      }
      else {
        setRes(true)
        setMessage('Registration failed')
        setMtype('Warning')
        setTimeout(() => {
          setRes(false)
        }, 3000);
      }
    }
    else {
      setRes(true)
      setMessage('Invalid Data')
      setMtype('Warning')
      setTimeout(() => {
        setRes(false)
      }, 3000);
    }
  }

  return (
    <>
      <main>
        <div className="flex flex-col w-2/3 mx-auto my-5 lg:w-2/4">
          {res && < Alert type={mtype} message={message} />}

          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font mx-auto">SignUp</h2>
          {/* <p className="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p> */}
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name <span className='text-red-500'>*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder='Full Name'
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
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
            <label htmlFor="file" className="leading-7 text-sm text-gray-600">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              name="profileImg"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(e) => setProfileImg(e.target.files[0])}
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
          >SignUp</button>
          <GoogleLogin type={"Up"} />
          <p className="text-s text-gray-500 mt-3">
            Already have an account? <span onClick={handleClick} className="text-indigo-500 hover:text-indigo-600 cursor-pointer">Login</span>
          </p>
          {/* <p className='mt-4'><span className='text-red-500'>*</span> fields are mandatory to fill</p> */}
        </div>
      </main>
    </>
  )
}

export default Signup
